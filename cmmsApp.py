from flask import Flask, jsonify
from sqlalchemy import create_engine
from config import con_string
import json
import random
import datetime as dt
from flask import request

engine = create_engine(con_string)



app = Flask(__name__)

@app.route("/")
def hello():
    return "Flask Index Page"

@app.route("/form_data")
def form_data():
    equipId = request.args.get('equipId')
    sql = """
        SELECT id, equipment_id, form_data
        FROM test.check_lists
        WHERE equipment_id = {0}
    """.format(equipId)

    res = engine.execute(sql).fetchall()
    response = []
    for row in res:
        response.append({
            'id': row[0],
            'equipId': row[1],
            'form_data': json.loads(row[2])
            })
    return json.dumps(response)

@app.route("/check_lists", methods=['POST'])
def check_lists():
    print 'yes'
    data = request.get_json()
    if data['id'] == 'none':
        seconds = int(
            (dt.datetime.now() - dt.datetime.strptime('1970-01-01', '%Y-%m-%d')).total_seconds()
            )
        id = random.randint(1, 1000000) + seconds
    else:
        id = data['id']
    sql = """INSERT INTO test.check_lists (id, equipment_id, form_data)
            VALUES ({id}, {eID}, '{blob}')
            ON DUPLICATE KEY UPDATE form_data='{blob}' """.format(
        id=id,
        eID=data['equipmentId'],
        blob=json.dumps(data['data'])
        )
    # engine.execute(sql)
    print sql
    data['id'] = id
    return jsonify(data)

@app.route("/equipment")
def equipment():
    site_id = request.args.get('id')
    sql = "select name, description from prod.equipment where site_id={0}".format(site_id)
    res = engine.execute(sql).fetchall()
    response = []
    for row in res:
        response.append({'name': row[0], 'description': row[1]})
    return json.dumps(response)

@app.route("/test_equipment")
def test_equipment():
    site_id = request.args.get('id')
    sql = "select name, description, serial_number, make, id from test.equipment where site_id={0}".format(site_id)
    res = engine.execute(sql).fetchall()
    response = []
    for row in res:
        response.append({
            'name': row[0],
            'description': row[1],
            'serial_number': row[2],
            'manufacturer': row[3],
            'id': row[4]
            })
    return json.dumps(response)

@app.route("/test_sites")
def test_sites():
    sql = "select name, street, city, state, zip, id from test.sites"
    res = engine.execute(sql).fetchall()
    response = []
    for row in res:
        response.append({
            'name': row[0],
            'street': row[1],
            'city': row[2],
            'state': row[3],
            'zip': row[4],
            'id': row[5]
            })
    return json.dumps(response)

if __name__ == "__main__":
    app.run()
