from sqlalchemy import create_engine
from config import con_string
import datetime as dt
import random

def gen_id():
    seconds = int(
        (dt.datetime.now() - dt.datetime.strptime('1970-01-01', '%Y-%m-%d')).total_seconds()
        )
    return random.randint(1, 1000000) + seconds

engine = create_engine(con_string)

def gen_events(days):
    today = dt.datetime.today()
    ds = (today + dt.timedelta(days=days + 1)).strftime('%Y-%m-%d')


    sql = """
        SELECT
            id AS check_list_id,
            equipment_id,
            frequency,
            due_date
        FROM
        (SELECT
            cl.id,
            e.id AS event_id,
            cl.equipment_id,
            cl.frequency,
            cl.due_date
        FROM
            test.check_lists cl LEFT JOIN
            test.events e
            ON
                cl.id = e.check_list_id
                AND cl.due_date = e.due_date
        WHERE
            date(cl.due_date) <= date('{ds}')
            AND (e.is_open IS NULL OR e.is_open = 0)
            AND cl.frequency = {days}
            ) a
        WHERE
            event_id IS NULL
        """.format(ds=ds, days=days)

    results = engine.execute(sql).fetchall()


    if len(results) > 0:
        vals = []
        ids = []
        for row in results:
            ids.append('{0}'.format(row[0]))
            vals.append('{0}'.format((gen_id(), row[1], row[0], row[3], 1)))

        sql = """
            INSERT INTO test.events (id, equipment_id, check_list_id, due_date, is_open)
            VALUES {vals}
        """.format(vals=', '.join(vals))
        engine.execute(sql)

        sql = """
            UPDATE test.check_lists
            SET due_date = date_format(date_add(date(due_date), INTERVAL {days} DAY), '%%Y-%%m-%%d')
            WHERE id IN ({ids})
        """.format(days=days, ids=', '.join(ids))
        engine.execute(sql)

for day in [7, 30, 90]:
    gen_events(day)
