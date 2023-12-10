from pathlib import Path


def make_directory(directory: Path):
    if not directory.is_dir():
        if directory.exists():
            raise RuntimeError(f'Path {directory} exists, but not as a directory.')

        directory.mkdir(parents=True)