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


skeleton = partial(one_stack, "skeleton")
walking_dead = partial(one_stack, "walking_dead")
wight = partial(one_stack, "wight")
vampire = partial(one_stack, "vampire")
green_dragon = partial(one_stack, "green_dragon")
red_dragon = partial(one_stack, "red_dragon")
gold_dragon = partial(one_stack, "gold_dragon")
black_dragon = partial(one_stack, "black_dragon")


# TODO: expand the levels list to royal griffins etc
CREATURE_BANKS = {
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
        {"guards": five_stacks("dragon_fly", 30)},
        {"guards": five_stacks("dragon_fly", 45)},
        {"guards": five_stacks("dragon_fly", 60)},
        {"guards": five_stacks("dragon_fly", 90)},
    ],
    "dragon_utopia": [
        {"guards": [green_dragon(8), red_dragon(5), gold_dragon(2), black_dragon(1)]},
        {"guards": [green_dragon(8), red_dragon(6), gold_dragon(3), black_dragon(2)]},
        {"guards": [green_dragon(8), red_dragon(6), gold_dragon(4), black_dragon(3)]},
        {"guards": [green_dragon(8), red_dragon(7), gold_dragon(6), black_dragon(5)]},
    ],
    "dwarven_treasury": [
        {"guards": five_stacks("dwarf", 50)},
        {"guards": five_stacks("dwarf", 75)},
        {"guards": five_stacks("dwarf", 100)},
        {"guards": five_stacks("dwarf", 150)},
    ],
    "experimental_shop": [
        {"guards": five_stacks("steel_golem", 25)},
        {"guards": five_stacks("steel_golem", 50)},
        {"guards": five_stacks("steel_golem", 75)},
        {"guards": five_stacks("steel_golem", 100)},
    ],
    "griffin_conservatory": [
        {"guards": five_stacks("griffin", 50)},
        {"guards": five_stacks("griffin", 100)},
        {"guards": five_stacks("griffin", 150)},
        {"guards": five_stacks("griffin", 200)},
    ],
    "imp_cache": [{"guards": []}],
    "mansion": [
        {"guards": five_stacks("vampire_lord", 40)},
        {"guards": five_stacks("vampire_lord", 60)},
        {"guards": five_stacks("vampire_lord", 80)},
        {"guards": five_stacks("vampire_lord", 100)},
    ],
    "medusa_stores": [
        {"guards": five_stacks("medusa", 20)},
        {"guards": five_stacks("medusa", 30)},
        {"guards": five_stacks("medusa", 40)},
        {"guards": five_stacks("medusa", 50)},
    ],
    "naga_bank": [
        {"guards": five_stacks("naga", 10)},
        {"guards": five_stacks("naga", 15)},
        {"guards": five_stacks("naga", 20)},
        {"guards": five_stacks("naga", 30)},
    ],
    "red_tower": [
        {"guards": five_stacks("fire_elemental", 35)},
        {"guards": five_stacks("fire_elemental", 70)},
        {"guards": five_stacks("fire_elemental", 105)},
        {"guards": five_stacks("fire_elemental", 140)},
    ],
    "wolf_raider_picket": [
        {"guards": five_stacks("wolf_raider", 50)},
        {"guards": five_stacks("wolf_raider", 75)},
        {"guards": five_stacks("wolf_raider", 100)},
        {"guards": five_stacks("wolf_raider", 150)},
    ],
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

    @app.route("/images/banks")
    def banks_list():
        banks_path = Path(app.root_path) / "data" / "images" / "banks"
        xs = []
        for file_path in sorted(filter(lambda x: x.is_file(), banks_path.iterdir())):
            name = file_path.name.rsplit(file_path.suffix, 1)[0]
            o = {
                "name": name,
                "image": str(file_path.relative_to(app.root_path)),
                "creature_bank": CREATURE_BANKS[name],
            }
            xs.append(o)

        return jsonify({"banks": xs})

    @app.route("/images/banks/<path:path>")
    def banks(path: str):
        return send_from_directory(
            os.path.join(app.root_path, "data/images/banks"), path
        )

    return app
