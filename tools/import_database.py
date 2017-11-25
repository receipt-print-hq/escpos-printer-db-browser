#!/usr/bin/env python
import json
import collections
import os
import requests

# Will load from filename if available, otherwise URL will be hit for latest DB
CAP_URL = "https://raw.githubusercontent.com/receipt-print-hq/escpos-printer-db/master/dist/capabilities.json"
CAP_FILENAME = 'capabilities.json'
SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

def produce_dir(fn):
    path = SCRIPT_PATH + '/../dist/data/' + fn
    if not os.path.isdir(path):
        os.mkdir(path)

def write_out(data_obj, fn):
    """
    Write out JSON data
    """
    data_bytes = json.dumps(data_obj, sort_keys=True, indent=4, separators=(',', ': '))
    with open(SCRIPT_PATH + '/../dist/data/' + fn, "wb+") as json_f:
        json_f.write(data_bytes.encode('utf-8'))

def produce_list(data, keys):
    """
    Return name and ID as list from objects in the database.
    """
    return [
        {'id': k,
         'name': data[k]['name']
        } for k in keys]

def produce_encoding(encoding_id, db_data, profile_keys):
    enc = db_data['encodings'][encoding_id]
    enc['id'] = encoding_id
    enc['profiles'] = [
        {'id': x,
         'name': db_data['profiles'][x]['name']
        } for x in profile_keys if encoding_id in db_data['profiles'][x]['codePages'].values()]
    return enc

def dict_to_list(inp_obj):
    """
    Take dictionary and return list of key value pairs.
    """
    # Test for dict with numeric keys
    unsorted_keys = inp_obj.keys()
    non_numeric_keys = [x for x in unsorted_keys if not x.isdigit()]
    if len(unsorted_keys) == 0:
        return []
    elif len(non_numeric_keys) == 0:
        # Numeric keys, sort numeric and write numeric
        obj_keys = sorted(unsorted_keys, key=lambda s: int(s))
        return [{'key': int(k), 'val': inp_obj[k]} for k in obj_keys]
    else:
        # Text keys, sort case insensitive
        obj_keys = sorted(unsorted_keys, key=lambda s: s.lower())
        return [{'key': k, 'val': inp_obj[k]} for k in obj_keys]

def produce_profile(profile_id, db_data):
    prof = db_data['profiles'][profile_id]
    prof['id'] = profile_id
    prof['features'] = dict_to_list(prof['features'])
    prof['codePages'] = dict_to_list(prof['codePages'])
    prof['fonts'] = dict_to_list(prof['fonts'])
    prof['colors'] = dict_to_list(prof['colors'])
    return prof

def produce_vendor(vendor_id, vendor_data, db_data):
    vendor_name = vendor_data[vendor_id]['name']
    vendor_profiles = []
    return {
        'id': vendor_id,
        'name': vendor_name,
        'profiles': vendor_profiles
    }


def process_db():
    """
    Load and process the DB
    """
    if not os.path.isfile(CAP_FILENAME):
        # Import data directly from GitHub
        response = requests.get(CAP_URL)
        db_text = response.text
    else:
        # Load from local file
        db_text = open(CAP_FILENAME).read()
    db_data = json.loads(db_text)

    # Main output directory
    produce_dir('')

    # Sorted keys
    profile_keys = sorted(db_data['profiles'].keys(), key=lambda s: s.lower())
    encoding_keys = sorted(db_data['encodings'].keys(), key=lambda s: s.lower())

    # Extract list of known vendors
    vendors = {
        x.replace(' ', '_'): {
            'name': x
        }
        for x in list(set([db_data['profiles'][x]['vendor'] for x in profile_keys]))}
    vendor_keys = sorted(vendors.keys(), key=lambda s: s.lower())

    #vendor_names = {}
    #vendor_names = sorted()), key=lambda s: s.lower())
    #vendor_keys = [x.replace(' ', '_') for x in vendor_names]

    # Process encodings
    produce_dir('encodings')
    # Main list
    write_out(produce_list(db_data['encodings'], encoding_keys), 'encodings/index.json')
    # Output for each profile
    for i in encoding_keys:
        write_out(produce_encoding(i, db_data, profile_keys), 'encodings/' + i + '.json')

    # Process profiles
    produce_dir('profiles')
    write_out(produce_list(db_data['profiles'], profile_keys), 'profiles/index.json')
    for i in profile_keys:
        write_out(produce_profile(i, db_data), 'profiles/' + i + '.json')

    # Process vendors
    produce_dir('vendors')
    write_out(produce_list(vendors, vendor_keys), 'vendors/index.json')
    for i in vendor_keys:
        write_out(produce_vendor(i, vendors, db_data), 'vendors/' + i + '.json')

if __name__ == '__main__':
    """
    Load and process the DB
    """
    process_db()
