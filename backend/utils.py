from datetime import datetime, timezone
from database import supabase


def generate_matricule(table: str, prefix: str) -> str:
    year = datetime.now(timezone.utc).strftime("%y")
    pattern = f"PES{prefix}{year}"

    result = (
        supabase.table(table)
        .select("matricule")
        .like("matricule", f"{pattern}%")
        .order("matricule", desc=True)
        .limit(1)
        .execute()
    )

    if result.data and result.data[0].get("matricule"):
        last_num = int(result.data[0]["matricule"][-5:])
        next_num = last_num + 1
    else:
        next_num = 1

    return f"{pattern}{str(next_num).zfill(5)}"
