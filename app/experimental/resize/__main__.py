import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import ImageSequence

from app import imagelib
from app.filelib import make_directory


def main():
    root_dir = Path(__file__).parent.parent.parent
    banks = imagelib.from_directory(root_dir / 'data' / 'banks')
    out_dir = root_dir / 'data' / 'images' / 'banks'
    make_directory(out_dir)
    sizes = np.array([b.image.size for b in banks], dtype=int)
    # target_size = np.percentile(sizes, q=68.27, interpolation='nearest', axis=0)
    target_size = (92, 89)
    assert sizes.shape == (sizes.shape[0], 2)
    print('target_size', target_size)

    for bank in banks:
        out_path = out_dir / bank.path.name
        image = bank.image
        if (np.asarray(bank.image.size) > target_size).any():
            size = np.asarray(image.size)
            sizes = np.array([size, tuple(target_size)])
            new_size = sizes.min(axis=0)
            ratio = size / new_size
            divisor = max(ratio)
            out_size = tuple((size / divisor).round().astype(int))
            images = ImageSequence.Iterator(image)
            out_images = [x.resize(out_size) for x in images]
            imagelib.save_gif(out_path, out_images)
            print('Resized', bank.name, 'to', out_size)
        else:
            shutil.copy2(*map(str, (bank.path, out_path)))
            print('Copied', bank.name, 'with size', image.size)


if __name__ == '__main__':
    sys.exit(main())
