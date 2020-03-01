import sys
from operator import attrgetter
from pathlib import Path

from app.data import imagelib


def main():
    current_path = Path(__file__).parent
    current_path = current_path.resolve()
    banks_dir = current_path / 'banks'
    out_dir = current_path / 'images' / 'banks'
    if not out_dir.is_dir():
        out_dir.mkdir(parents=True)

    banks = [imagelib.open(p) for p in banks_dir.iterdir()]

    for fun in (min, max):
        for key in (attrgetter('image.width'), attrgetter('image.height')):
            print(fun.__name__, key, fun(banks, key=key))


if __name__ == '__main__':
    sys.exit(main())
