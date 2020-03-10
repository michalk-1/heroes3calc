import os
from functools import partial
from pathlib import Path

from flask import (
    Flask,
    render_template,
    url_for,
    redirect,
    request,
    jsonify,
    send_from_directory,
)

from app.via import csv as via_csv


def one_stack(name, number):
    return {"name": name, "number": number}


def five_stacks(name, number):
    assert number % 5 == 0, number
    return [one_stack(name, number // 5)] * 5


skeleton = partial(one_stack, "Skeleton")
walking_dead = partial(one_stack, "Walking Dead")
wight = partial(one_stack, "Wight")
vampire = partial(one_stack, "Vampire")
green_dragon = partial(one_stack, "Green Dragon")
red_dragon = partial(one_stack, "Red Dragon")
gold_dragon = partial(one_stack, "Gold Dragon")
black_dragon = partial(one_stack, "Black Dragon")


# TODO: expand the levels list to royal griffins etc
CREATURE_BANKS_0 = {
    "black_tower": [  # levels
        {"guards": [green_dragon(1)]},
        {"guards": [red_dragon(1)]},
        {"guards": [gold_dragon(1)]},
        {"guards": [black_dragon(1)]},
    ],
    "crypt": [
        {
            "guards": [
                skeleton(10),
                walking_dead(10),
                walking_dead(10),
                skeleton(10),
                skeleton(10),
            ]
        },
        {
            "guards": [
                skeleton(13),
                walking_dead(10),
                wight(5),
                walking_dead(10),
                skeleton(12),
            ]
        },
        {"guards": [skeleton(20), walking_dead(20), wight(10), vampire(5)]},
        {"guards": [skeleton(20), walking_dead(20), wight(10), vampire(10)]},
    ],
    "dragon_fly_hive": [
        {"guards": five_stacks("Dragon Fly", 30)},
        {"guards": five_stacks("Dragon Fly", 45)},
        {"guards": five_stacks("Dragon Fly", 60)},
        {"guards": five_stacks("Dragon Fly", 90)},
    ],
    "dragon_utopia": [
        {"guards": [green_dragon(8), red_dragon(5), gold_dragon(2), black_dragon(1)]},
        {"guards": [green_dragon(8), red_dragon(6), gold_dragon(3), black_dragon(2)]},
        {"guards": [green_dragon(8), red_dragon(6), gold_dragon(4), black_dragon(3)]},
        {"guards": [green_dragon(8), red_dragon(7), gold_dragon(6), black_dragon(5)]},
    ],
    "dwarven_treasury": [
        {"guards": five_stacks("Dwarf", 50)},
        {"guards": five_stacks("Dwarf", 75)},
        {"guards": five_stacks("Dwarf", 100)},
        {"guards": five_stacks("Dwarf", 150)},
    ],
    "experimental_shop": [
        {"guards": five_stacks("Steel Golem", 25)},
        {"guards": five_stacks("Steel Golem", 50)},
        {"guards": five_stacks("Steel Golem", 75)},
        {"guards": five_stacks("Steel Golem", 100)},
    ],
    "griffin_conservatory": [
        {"guards": five_stacks("Griffin", 50)},
        {"guards": five_stacks("Griffin", 100)},
        {"guards": five_stacks("Griffin", 150)},
        {"guards": five_stacks("Griffin", 200)},
    ],
    "imp_cache": [{"guards": []}],
    "mansion": [
        {"guards": five_stacks("Vampire Lord", 40)},
        {"guards": five_stacks("Vampire Lord", 60)},
        {"guards": five_stacks("Vampire Lord", 80)},
        {"guards": five_stacks("Vampire Lord", 100)},
    ],
    "medusa_stores": [
        {"guards": five_stacks("Medusa", 20)},
        {"guards": five_stacks("Medusa", 30)},
        {"guards": five_stacks("Medusa", 40)},
        {"guards": five_stacks("Medusa", 50)},
    ],
    "naga_bank": [
        {"guards": five_stacks("Naga", 10)},
        {"guards": five_stacks("Naga", 15)},
        {"guards": five_stacks("Naga", 20)},
        {"guards": five_stacks("Naga", 30)},
    ],
    "red_tower": [
        {"guards": five_stacks("Fire Elemental", 35)},
        {"guards": five_stacks("Fire Elemental", 70)},
        {"guards": five_stacks("Fire Elemental", 105)},
        {"guards": five_stacks("Fire Elemental", 140)},
    ],
    "wolf_raider_picket": [
        {"guards": five_stacks("Wolf Raider", 50)},
        {"guards": five_stacks("Wolf Raider", 75)},
        {"guards": five_stacks("Wolf Raider", 100)},
        {"guards": five_stacks("Wolf Raider", 150)},
    ],
}
CREATURE_BANKS = {
    key: {"name": " ".join(map(str.capitalize, key.split("_"))), "levels": levels}
    for key, levels in CREATURE_BANKS_0.items()
}


def create_app(test_config=None):
    # create and configure the app
    app = Flask(
        __name__, instance_relative_config=True, static_folder="a", template_folder="a",
    )

    app.config.from_mapping(
        SECRET_KEY="dev", DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/a/h3calc")
    def h3calc():
        return render_template("index.html")

    @app.route("/")
    def root():
        return redirect(url_for("h3calc"), code=302)

    allowed_queries = ("town", "name")

    @app.route("/d/list_of_creatures")
    def list_of_creatures():
        query = {
            key: value for key, value in request.args.items() if key in allowed_queries
        }
        return jsonify(via_csv.list_of_creatures(**query))

    @app.route("/favicon.ico")
    def favicon():
        return send_from_directory(
            app.root_path, "favicon.ico", mimetype="image/vnd.microsoft.icon"
        )

    @app.route("/d/banks")
    def banks_list():
        banks_path = Path(app.root_path) / "data" / "images" / "banks"
        xs = []
        for file_path in sorted(filter(lambda x: x.is_file(), banks_path.iterdir())):
            name = file_path.name.rsplit(file_path.suffix, 1)[0]
            o = {'image': str(file_path.relative_to(app.root_path))}
            o.update(CREATURE_BANKS[name])
            xs.append(o)

        return jsonify({"banks": xs})

    @app.route("/images/banks/<path:path>")
    def banks(path: str):
        return send_from_directory(
            os.path.join(app.root_path, "data/images/banks"), path
        )

    return app
