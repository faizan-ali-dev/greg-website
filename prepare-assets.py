from pathlib import Path
from PIL import Image
root = Path(__file__).parent / 'dist' / 'assets'
image = Image.open(root / 'gregory-denizard.png').convert('RGB')
image.thumbnail((960,960), Image.Resampling.LANCZOS)
image.save(root / 'gregory-denizard.webp', quality=88, method=6)
print('Optimized portrait:', (root / 'gregory-denizard.webp').stat().st_size, 'bytes')
