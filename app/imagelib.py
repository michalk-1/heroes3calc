import os
from pathlib import Path
from typing import NamedTuple, Sequence

import PIL.Image
from PIL.Image import Image


class ImageFile(NamedTuple):

    name: str
    extension: str
    path: Path
    image: Image


def open_image(path: Path) -> ImageFile:
    name, *_ = os.path.splitext(path.name)
    return ImageFile(
        name=name,
        extension=''.join(path.suffixes).lower(),
        path=path,
        image=PIL.Image.open(path),
    )


def save_gif(path: Path, images: Sequence[Image]):
    images[0].save(path, save_all=True, append_images=images[1:])


def from_directory(path) -> Sequence[ImageFile]:
    return [open_image(p) for p in path.iterdir()]
