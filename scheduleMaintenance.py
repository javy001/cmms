from sqlalchemy import create_engine
from config import con_string

engine = create_engine(con_string)

sql = """
    SELECT
        id,
        equipment_id,
        frequency,
        due_date
    FROM
        test.check_lists
    WHERE
        due_date IS NOT NULL
    """

results = engine.execute(sql).fetchall()
print results
