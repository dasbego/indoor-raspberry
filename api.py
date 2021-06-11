#!/usr/bin/python3
from flask import Flask, jsonify, request
from uuid import uuid4
import firebase

app = Flask(__name__)
conn = firebase.get_connection()

@app.route('/plants')
def get_all_plants():
    plants = conn.child('plants').get()
    return jsonify(plants.val()), 200

@app.route('/plants', methods=['POST'])
def add_plant():
    plant = request.get_json()
    _id = str(uuid4())
    plant['id'] = _id
    plant['name'] = plant["name"]
    conn.child('plants').child(_id).set(plant)
    return jsonify(plant), 200

@app.route('/plants/<index>', methods=['PUT'])
def update_plant(index):
    plant = request.get_json()
    plant_found = conn.child('plants').child(index).get()
    if (plant_found):
        conn.child('plants').child(index).update(plant)
        updated_plant = conn.child('plants').child(index).get()
        return jsonify(updated_plant.val()), 200
    else:
        return jsonify({ 'message': 'Plant index not found' }), 404

@app.route('/plants/<index>', methods=['DELETE'])
def delete_plant(index):
    plant_found = conn.child('plants').child(index).get()
    if (plant_found):
        conn.child('plants').child(index).remove()
        return 'None', 200
    return jsonify({ 'message': 'Plant index not found' }), 404

@app.route('/records')
def get_all_records():
    records = conn.child('records').get()
    return jsonify(records.val()), 200

@app.route('/records', methods=['POST'])
def add_record():
    record = request.get_json()
    # Save only records that has a plant registered
    _id = record.get('id')
    new_record = record
    if (_id):
        registered_plant = conn.child('plants').child(_id).get()
        if (registered_plant.val()):
            new_record['id'] = registered_plant.val()['id']
            new_record['name'] = registered_plant.val()['name']
            conn.child('records').push(new_record)
            return jsonify(new_record)
        else:
            return jsonify({ 'message': 'Plant id is not registered' }), 404
    else:
        return jsonify({ 'message': 'Must contain an ID' }), 400

@app.route('/records/<plant_id>')
def get_records_by_id(plant_id):
    plant_records = conn.child('records').order_by_child('id').equal_to(plant_id).get()
    if (plant_records):
        return plant_records.val(), 200
    else:
        return jsonify({ 'message': 'Plant ID not found'})

if __name__ == '__main__':
    app.run(debug=True, host= '0.0.0.0', port=80)
