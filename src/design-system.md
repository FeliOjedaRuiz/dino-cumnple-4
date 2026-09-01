# Design System: Dino Cumple 4

Este documento define la base visual del sitio, basada en la estética de **Thomas & Friends (All Engines Go)**.

## Paleta de Colores
Utilizamos la paleta de locomotoras como tokens principales.

| Token | Color (Base) | Uso |
|---|---|---|
| `tren-azul` | `#2D8FD9` | Thomas · Hero, títulos, links, badges |
| `tren-rojo` | `#D8322B` | James · CTA primaria, alertas |
| `tren-amarillo`| `#F4C430` | Cascos · Highlights, badges, número 4 |
| `tren-verde` | `#5BB04A` | Percy · Secciones de acento |
| `tren-violeta`| `#A86BC4` | Kana · Acentos, badges secundarios |
| `tren-negro` | `#1A1A1A` | Texto cuerpo, humo, sombras duras |

## Tipografía

| Rol | Font | Peso | Uso |
|---|---|---|---|
| **Display** | Lilita One | 400 | Títulos Hero (efecto sticker SVG) |
| **Encabezados**| Fredoka | 700 | Secciones, badges, elementos UI |
| **Cuerpo** | Nunito | 400-800 | Párrafos, textos informativos |
| **Secundario** | Quicksand | 400-600 | Subtítulos, fechas, labels |

## Efectos visuales ("Thomas Sticker")

Los títulos principales (ej: Hero) deben usar la técnica de **SVG con 3 capas**:
1. **Capa base (halo blanco)**: `stroke="white"`, `stroke-width` grueso, une todas las letras.
2. **Capa media (outline oscuro)**: `stroke` (color derivado del fill, más oscuro), stroke-width medio.
3. **Capa superior (gradiente)**: `fill="url(#gradient)"`.
4. **Efecto depth**: CSS `filter: drop-shadow(5px 5px 0 #1A1A1A)`.

## Reglas de composición
- **Mobile-first**: Hero full-bleed, resto del contenido en contenedor centrado con gutter de 16px.
- **Botones**: Píldora (`rounded-full`), con `box-shadow` chunky para 3D.
- **Tarjetas**: `rounded-2xl` o `3xl`, bordes gruesos (`border-4`) para estilo sticker.
