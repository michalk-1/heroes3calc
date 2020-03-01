import os
from pathlib import Path
from typing import NamedTuple

import PIL.Image
from PIL.Image import Image


class ImageInfo(NamedTuple):

    name: str
    extension: str
    image: Image


def open(path: Path) -> ImageInfo:
    name, *_ = os.path.splitext(path.name)
    with path.open('rb') as fp:
        return ImageInfo(
            name=name,
            extension=''.join(path.suffixes).lower(),
            image=PIL.Image.open(fp),
        )
