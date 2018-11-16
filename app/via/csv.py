import csv
import os


def list_of_creatures(*, town=None, name=None):
    filename = 'List_of_creatures' if town is None else town.lower().capitalize()
    file = 'h3calc/data/{filename}.csv'.format(filename=filename)

    if os.path.exists(file):
        with open(file) as csv_file:
            reader = csv.DictReader(csv_file)
            result = list(reader)
    else:
        result = []

    if name is not None:
        name = name.lower()
        result = [x for x in result if x['name'].lower() == name]

    return {'uri': result}
