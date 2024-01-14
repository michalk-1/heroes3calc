from pathlib import Path


def make_directory(directory: Path) -> None:
    if not directory.is_dir() and directory.exists():
        raise RuntimeError(f"Path {directory} exists, but is not as a directory.")

    directory.mkdir(parents=True)
