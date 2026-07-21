/**
 * Sticker Loader Utility
 * AUTO-GENERATED FILE - Do not edit manually!
 * Run: node scripts/generateStickers.js to regenerate
 *
 * This file automatically loads sticker assets from local filesystem.
 * To add new stickers, just add files to the folders and run the generate script.
 */

import type { ImageSourcePropType } from 'react-native'

type StickerAsset = {
  readonly id: string
  readonly name: string
  readonly source: ImageSourcePropType
}

type StickerPackAssets = {
  readonly icon: string
  readonly id: string
  readonly name: string
  readonly stickers: readonly StickerAsset[]
}

// Helper function to create sticker asset
const createSticker = (
  packId: string,
  index: number,
  name: string,
  requireFunction: () => ImageSourcePropType,
): StickerAsset => ({
  id: `${packId}-${index}`,
  name,
  source: requireFunction(),
})

// Sticker Packs with local assets - AUTO-GENERATED
export const STICKER_PACKS: readonly StickerPackAssets[] = [
  {
    icon: '👶',
    id: 'baby-1',
    name: 'Baby',
    stickers: [
      createSticker('baby-1', 0, 'Baby 1', () =>
        require('@/theme/assets/stickers/Baby-1/0.thumb128.webp'),
      ),
      createSticker('baby-1', 1, 'Baby 2', () =>
        require('@/theme/assets/stickers/Baby-1/1.thumb128.webp'),
      ),
      createSticker('baby-1', 2, 'Baby 3', () =>
        require('@/theme/assets/stickers/Baby-1/2.thumb128.webp'),
      ),
      createSticker('baby-1', 3, 'Baby 4', () =>
        require('@/theme/assets/stickers/Baby-1/3.thumb128.webp'),
      ),
      createSticker('baby-1', 4, 'Baby 5', () =>
        require('@/theme/assets/stickers/Baby-1/4.thumb128.webp'),
      ),
      createSticker('baby-1', 5, 'Baby 6', () =>
        require('@/theme/assets/stickers/Baby-1/5.thumb128.webp'),
      ),
      createSticker('baby-1', 6, 'Baby 7', () =>
        require('@/theme/assets/stickers/Baby-1/6.thumb128.webp'),
      ),
      createSticker('baby-1', 7, 'Baby 8', () =>
        require('@/theme/assets/stickers/Baby-1/7.thumb128.webp'),
      ),
      createSticker('baby-1', 8, 'Baby 9', () =>
        require('@/theme/assets/stickers/Baby-1/8.thumb128.webp'),
      ),
      createSticker('baby-1', 9, 'Baby 10', () =>
        require('@/theme/assets/stickers/Baby-1/9.thumb128.webp'),
      ),
      createSticker('baby-1', 10, 'Baby 11', () =>
        require('@/theme/assets/stickers/Baby-1/10.thumb128.webp'),
      ),
      createSticker('baby-1', 11, 'Baby 12', () =>
        require('@/theme/assets/stickers/Baby-1/11.thumb128.webp'),
      ),
      createSticker('baby-1', 12, 'Baby 13', () =>
        require('@/theme/assets/stickers/Baby-1/12.thumb128.webp'),
      ),
      createSticker('baby-1', 13, 'Baby 14', () =>
        require('@/theme/assets/stickers/Baby-1/13.thumb128.webp'),
      ),
      createSticker('baby-1', 14, 'Baby 15', () =>
        require('@/theme/assets/stickers/Baby-1/14.thumb128.webp'),
      ),
      createSticker('baby-1', 15, 'Baby 16', () =>
        require('@/theme/assets/stickers/Baby-1/15.thumb128.webp'),
      ),
      createSticker('baby-1', 16, 'Baby 17', () =>
        require('@/theme/assets/stickers/Baby-1/16.thumb128.webp'),
      ),
      createSticker('baby-1', 17, 'Baby 18', () =>
        require('@/theme/assets/stickers/Baby-1/17.thumb128.webp'),
      ),
      createSticker('baby-1', 18, 'Baby 19', () =>
        require('@/theme/assets/stickers/Baby-1/18.thumb128.webp'),
      ),
      createSticker('baby-1', 19, 'Baby 20', () =>
        require('@/theme/assets/stickers/Baby-1/19.thumb128.webp'),
      ),
      createSticker('baby-1', 20, 'Baby 21', () =>
        require('@/theme/assets/stickers/Baby-1/20.thumb128.webp'),
      ),
      createSticker('baby-1', 21, 'Baby 22', () =>
        require('@/theme/assets/stickers/Baby-1/21.thumb128.webp'),
      ),
      createSticker('baby-1', 22, 'Baby 23', () =>
        require('@/theme/assets/stickers/Baby-1/22.thumb128.webp'),
      ),
      createSticker('baby-1', 23, 'Baby 24', () =>
        require('@/theme/assets/stickers/Baby-1/23.thumb128.webp'),
      ),
      createSticker('baby-1', 24, 'Baby 25', () =>
        require('@/theme/assets/stickers/Baby-1/24.thumb128.webp'),
      ),
      createSticker('baby-1', 25, 'Baby 26', () =>
        require('@/theme/assets/stickers/Baby-1/25.thumb128.webp'),
      ),
      createSticker('baby-1', 26, 'Baby 27', () =>
        require('@/theme/assets/stickers/Baby-1/26.thumb128.webp'),
      ),
      createSticker('baby-1', 27, 'Baby 28', () =>
        require('@/theme/assets/stickers/Baby-1/27.thumb128.webp'),
      ),
      createSticker('baby-1', 28, 'Baby 29', () =>
        require('@/theme/assets/stickers/Baby-1/28.thumb128.webp'),
      ),
      createSticker('baby-1', 29, 'Baby 30', () =>
        require('@/theme/assets/stickers/Baby-1/29.thumb128.webp'),
      ),
      createSticker('baby-1', 30, 'Baby 31', () =>
        require('@/theme/assets/stickers/Baby-1/30.thumb128.webp'),
      ),
      createSticker('baby-1', 31, 'Baby 32', () =>
        require('@/theme/assets/stickers/Baby-1/31.thumb128.webp'),
      ),
      createSticker('baby-1', 32, 'Baby 33', () =>
        require('@/theme/assets/stickers/Baby-1/32.thumb128.webp'),
      ),
      createSticker('baby-1', 33, 'Baby 34', () =>
        require('@/theme/assets/stickers/Baby-1/33.thumb128.webp'),
      ),
      createSticker('baby-1', 34, 'Baby 35', () =>
        require('@/theme/assets/stickers/Baby-1/34.thumb128.webp'),
      ),
      createSticker('baby-1', 35, 'Baby 36', () =>
        require('@/theme/assets/stickers/Baby-1/35.thumb128.webp'),
      ),
      createSticker('baby-1', 36, 'Baby 37', () =>
        require('@/theme/assets/stickers/Baby-1/36.thumb128.webp'),
      ),
      createSticker('baby-1', 37, 'Baby 38', () =>
        require('@/theme/assets/stickers/Baby-1/37.thumb128.webp'),
      ),
      createSticker('baby-1', 38, 'Baby 39', () =>
        require('@/theme/assets/stickers/Baby-1/38.thumb128.webp'),
      ),
      createSticker('baby-1', 39, 'Baby 40', () =>
        require('@/theme/assets/stickers/Baby-1/39.thumb128.webp'),
      ),
      createSticker('baby-1', 40, 'Baby 41', () =>
        require('@/theme/assets/stickers/Baby-1/40.thumb128.webp'),
      ),
      createSticker('baby-1', 41, 'Baby 42', () =>
        require('@/theme/assets/stickers/Baby-1/41.thumb128.webp'),
      ),
      createSticker('baby-1', 42, 'Baby 43', () =>
        require('@/theme/assets/stickers/Baby-1/42.thumb128.webp'),
      ),
      createSticker('baby-1', 43, 'Baby 44', () =>
        require('@/theme/assets/stickers/Baby-1/43.thumb128.webp'),
      ),
      createSticker('baby-1', 44, 'Baby 45', () =>
        require('@/theme/assets/stickers/Baby-1/44.thumb128.webp'),
      ),
      createSticker('baby-1', 45, 'Baby 46', () =>
        require('@/theme/assets/stickers/Baby-1/45.thumb128.webp'),
      ),
      createSticker('baby-1', 46, 'Baby 47', () =>
        require('@/theme/assets/stickers/Baby-1/46.thumb128.webp'),
      ),
      createSticker('baby-1', 47, 'Baby 48', () =>
        require('@/theme/assets/stickers/Baby-1/47.thumb128.webp'),
      ),
      createSticker('baby-1', 48, 'Baby 49', () =>
        require('@/theme/assets/stickers/Baby-1/48.thumb128.webp'),
      ),
      createSticker('baby-1', 49, 'Baby 50', () =>
        require('@/theme/assets/stickers/Baby-1/49.thumb128.webp'),
      ),
      createSticker('baby-1', 50, 'Baby 51', () =>
        require('@/theme/assets/stickers/Baby-1/50.thumb128.webp'),
      ),
      createSticker('baby-1', 51, 'Baby 52', () =>
        require('@/theme/assets/stickers/Baby-1/51.thumb128.webp'),
      ),
      createSticker('baby-1', 52, 'Baby 53', () =>
        require('@/theme/assets/stickers/Baby-1/52.thumb128.webp'),
      ),
      createSticker('baby-1', 53, 'Baby 54', () =>
        require('@/theme/assets/stickers/Baby-1/53.thumb128.webp'),
      ),
      createSticker('baby-1', 54, 'Baby 55', () =>
        require('@/theme/assets/stickers/Baby-1/54.thumb128.webp'),
      ),
      createSticker('baby-1', 55, 'Baby 56', () =>
        require('@/theme/assets/stickers/Baby-1/55.thumb128.webp'),
      ),
      createSticker('baby-1', 56, 'Baby 57', () =>
        require('@/theme/assets/stickers/Baby-1/56.thumb128.webp'),
      ),
      createSticker('baby-1', 57, 'Baby 58', () =>
        require('@/theme/assets/stickers/Baby-1/57.thumb128.webp'),
      ),
      createSticker('baby-1', 58, 'Baby 59', () =>
        require('@/theme/assets/stickers/Baby-1/58.thumb128.webp'),
      ),
      createSticker('baby-1', 59, 'Baby 60', () =>
        require('@/theme/assets/stickers/Baby-1/59.thumb128.webp'),
      ),
      createSticker('baby-1', 60, 'Baby 61', () =>
        require('@/theme/assets/stickers/Baby-1/60.thumb128.webp'),
      ),
      createSticker('baby-1', 61, 'Baby 62', () =>
        require('@/theme/assets/stickers/Baby-1/61.thumb128.webp'),
      ),
      createSticker('baby-1', 62, 'Baby 63', () =>
        require('@/theme/assets/stickers/Baby-1/62.thumb128.webp'),
      ),
      createSticker('baby-1', 63, 'Baby 64', () =>
        require('@/theme/assets/stickers/Baby-1/63.thumb128.webp'),
      ),
      createSticker('baby-1', 64, 'Baby 65', () =>
        require('@/theme/assets/stickers/Baby-1/64.thumb128.webp'),
      ),
      createSticker('baby-1', 65, 'Baby 66', () =>
        require('@/theme/assets/stickers/Baby-1/65.thumb128.webp'),
      ),
      createSticker('baby-1', 66, 'Baby 67', () =>
        require('@/theme/assets/stickers/Baby-1/66.thumb128.webp'),
      ),
      createSticker('baby-1', 67, 'Baby 68', () =>
        require('@/theme/assets/stickers/Baby-1/67.thumb128.webp'),
      ),
      createSticker('baby-1', 68, 'Baby 69', () =>
        require('@/theme/assets/stickers/Baby-1/68.thumb128.webp'),
      ),
      createSticker('baby-1', 69, 'Baby 70', () =>
        require('@/theme/assets/stickers/Baby-1/69.thumb128.webp'),
      ),
      createSticker('baby-1', 70, 'Baby 71', () =>
        require('@/theme/assets/stickers/Baby-1/70.thumb128.webp'),
      ),
      createSticker('baby-1', 71, 'Baby 72', () =>
        require('@/theme/assets/stickers/Baby-1/71.thumb128.webp'),
      ),
      createSticker('baby-1', 72, 'Baby 73', () =>
        require('@/theme/assets/stickers/Baby-1/72.thumb128.webp'),
      ),
      createSticker('baby-1', 73, 'Baby 74', () =>
        require('@/theme/assets/stickers/Baby-1/73.thumb128.webp'),
      ),
      createSticker('baby-1', 74, 'Baby 75', () =>
        require('@/theme/assets/stickers/Baby-1/74.thumb128.webp'),
      ),
      createSticker('baby-1', 75, 'Baby 76', () =>
        require('@/theme/assets/stickers/Baby-1/75.thumb128.webp'),
      ),
      createSticker('baby-1', 76, 'Baby 77', () =>
        require('@/theme/assets/stickers/Baby-1/76.thumb128.webp'),
      ),
      createSticker('baby-1', 77, 'Baby 78', () =>
        require('@/theme/assets/stickers/Baby-1/77.thumb128.webp'),
      ),
      createSticker('baby-1', 78, 'Baby 79', () =>
        require('@/theme/assets/stickers/Baby-1/78.thumb128.webp'),
      ),
      createSticker('baby-1', 79, 'Baby 80', () =>
        require('@/theme/assets/stickers/Baby-1/79.thumb128.webp'),
      ),
      createSticker('baby-1', 80, 'Baby 81', () =>
        require('@/theme/assets/stickers/Baby-1/80.thumb128.webp'),
      ),
      createSticker('baby-1', 81, 'Baby 82', () =>
        require('@/theme/assets/stickers/Baby-1/81.thumb128.webp'),
      ),
      createSticker('baby-1', 82, 'Baby 83', () =>
        require('@/theme/assets/stickers/Baby-1/82.thumb128.webp'),
      ),
      createSticker('baby-1', 83, 'Baby 84', () =>
        require('@/theme/assets/stickers/Baby-1/83.thumb128.webp'),
      ),
      createSticker('baby-1', 84, 'Baby 85', () =>
        require('@/theme/assets/stickers/Baby-1/84.thumb128.webp'),
      ),
      createSticker('baby-1', 85, 'Baby 86', () =>
        require('@/theme/assets/stickers/Baby-1/85.thumb128.webp'),
      ),
      createSticker('baby-1', 86, 'Baby 87', () =>
        require('@/theme/assets/stickers/Baby-1/86.thumb128.webp'),
      ),
      createSticker('baby-1', 87, 'Baby 88', () =>
        require('@/theme/assets/stickers/Baby-1/87.thumb128.webp'),
      ),
      createSticker('baby-1', 88, 'Baby 89', () =>
        require('@/theme/assets/stickers/Baby-1/88.thumb128.webp'),
      ),
      createSticker('baby-1', 89, 'Baby 90', () =>
        require('@/theme/assets/stickers/Baby-1/89.thumb128.webp'),
      ),
      createSticker('baby-1', 90, 'Baby 91', () =>
        require('@/theme/assets/stickers/Baby-1/90.thumb128.webp'),
      ),
      createSticker('baby-1', 91, 'Baby 92', () =>
        require('@/theme/assets/stickers/Baby-1/91.thumb128.webp'),
      ),
      createSticker('baby-1', 92, 'Baby 93', () =>
        require('@/theme/assets/stickers/Baby-1/92.thumb128.webp'),
      ),
      createSticker('baby-1', 93, 'Baby 94', () =>
        require('@/theme/assets/stickers/Baby-1/93.thumb128.webp'),
      ),
      createSticker('baby-1', 94, 'Baby 95', () =>
        require('@/theme/assets/stickers/Baby-1/94.thumb128.webp'),
      ),
      createSticker('baby-1', 95, 'Baby 96', () =>
        require('@/theme/assets/stickers/Baby-1/95.thumb128.webp'),
      ),
      createSticker('baby-1', 96, 'Baby 97', () =>
        require('@/theme/assets/stickers/Baby-1/96.thumb128.webp'),
      ),
      createSticker('baby-1', 97, 'Baby 98', () =>
        require('@/theme/assets/stickers/Baby-1/97.thumb128.webp'),
      ),
      createSticker('baby-1', 98, 'Baby 99', () =>
        require('@/theme/assets/stickers/Baby-1/98.thumb128.webp'),
      ),
      createSticker('baby-1', 99, 'Baby 100', () =>
        require('@/theme/assets/stickers/Baby-1/99.thumb128.webp'),
      ),
      createSticker('baby-1', 100, 'Baby 101', () =>
        require('@/theme/assets/stickers/Baby-1/100.thumb128.webp'),
      ),
      createSticker('baby-1', 101, 'Baby 102', () =>
        require('@/theme/assets/stickers/Baby-1/101.thumb128.webp'),
      ),
      createSticker('baby-1', 102, 'Baby 103', () =>
        require('@/theme/assets/stickers/Baby-1/102.thumb128.webp'),
      ),
      createSticker('baby-1', 103, 'Baby 104', () =>
        require('@/theme/assets/stickers/Baby-1/103.thumb128.webp'),
      ),
      createSticker('baby-1', 104, 'Baby 105', () =>
        require('@/theme/assets/stickers/Baby-1/104.thumb128.webp'),
      ),
      createSticker('baby-1', 105, 'Baby 106', () =>
        require('@/theme/assets/stickers/Baby-1/105.thumb128.webp'),
      ),
      createSticker('baby-1', 106, 'Baby 107', () =>
        require('@/theme/assets/stickers/Baby-1/106.thumb128.webp'),
      ),
      createSticker('baby-1', 107, 'Baby 108', () =>
        require('@/theme/assets/stickers/Baby-1/107.thumb128.webp'),
      ),
      createSticker('baby-1', 108, 'Baby 109', () =>
        require('@/theme/assets/stickers/Baby-1/108.thumb128.webp'),
      ),
      createSticker('baby-1', 109, 'Baby 110', () =>
        require('@/theme/assets/stickers/Baby-1/109.thumb128.webp'),
      ),
      createSticker('baby-1', 110, 'Baby 111', () =>
        require('@/theme/assets/stickers/Baby-1/110.thumb128.webp'),
      ),
      createSticker('baby-1', 111, 'Baby 112', () =>
        require('@/theme/assets/stickers/Baby-1/111.thumb128.webp'),
      ),
      createSticker('baby-1', 112, 'Baby 113', () =>
        require('@/theme/assets/stickers/Baby-1/112.thumb128.webp'),
      ),
      createSticker('baby-1', 113, 'Baby 114', () =>
        require('@/theme/assets/stickers/Baby-1/113.thumb128.webp'),
      ),
      createSticker('baby-1', 114, 'Baby 115', () =>
        require('@/theme/assets/stickers/Baby-1/114.thumb128.webp'),
      ),
      createSticker('baby-1', 115, 'Baby 116', () =>
        require('@/theme/assets/stickers/Baby-1/115.thumb128.webp'),
      ),
      createSticker('baby-1', 116, 'Baby 117', () =>
        require('@/theme/assets/stickers/Baby-1/116.thumb128.webp'),
      ),
      createSticker('baby-1', 117, 'Baby 118', () =>
        require('@/theme/assets/stickers/Baby-1/117.thumb128.webp'),
      ),
      createSticker('baby-1', 118, 'Baby 119', () =>
        require('@/theme/assets/stickers/Baby-1/118.thumb128.webp'),
      ),
      createSticker('baby-1', 119, 'Baby 120', () =>
        require('@/theme/assets/stickers/Baby-1/119.thumb128.webp'),
      ),
    ],
  },
  {
    icon: '🐱',
    id: 'cat-1',
    name: 'Cat',
    stickers: [
      createSticker('cat-1', 0, 'Cat 1', () =>
        require('@/theme/assets/stickers/Cat-1/0-1.thumb128.png'),
      ),
      createSticker('cat-1', 1, 'Cat 2', () =>
        require('@/theme/assets/stickers/Cat-1/1-1.thumb128.png'),
      ),
      createSticker('cat-1', 2, 'Cat 3', () =>
        require('@/theme/assets/stickers/Cat-1/2-1.thumb128.png'),
      ),
      createSticker('cat-1', 3, 'Cat 4', () =>
        require('@/theme/assets/stickers/Cat-1/3-1.thumb128.png'),
      ),
      createSticker('cat-1', 4, 'Cat 5', () =>
        require('@/theme/assets/stickers/Cat-1/4-1.thumb128.png'),
      ),
      createSticker('cat-1', 5, 'Cat 6', () =>
        require('@/theme/assets/stickers/Cat-1/5-1.thumb128.png'),
      ),
      createSticker('cat-1', 6, 'Cat 7', () =>
        require('@/theme/assets/stickers/Cat-1/6-1.thumb128.png'),
      ),
      createSticker('cat-1', 7, 'Cat 8', () =>
        require('@/theme/assets/stickers/Cat-1/7-1.thumb128.png'),
      ),
      createSticker('cat-1', 8, 'Cat 9', () =>
        require('@/theme/assets/stickers/Cat-1/8-1.thumb128.png'),
      ),
      createSticker('cat-1', 9, 'Cat 10', () =>
        require('@/theme/assets/stickers/Cat-1/9-1.thumb128.png'),
      ),
      createSticker('cat-1', 10, 'Cat 11', () =>
        require('@/theme/assets/stickers/Cat-1/10-1.thumb128.png'),
      ),
      createSticker('cat-1', 11, 'Cat 12', () =>
        require('@/theme/assets/stickers/Cat-1/11-1.thumb128.png'),
      ),
      createSticker('cat-1', 12, 'Cat 13', () =>
        require('@/theme/assets/stickers/Cat-1/12-1.thumb128.png'),
      ),
      createSticker('cat-1', 13, 'Cat 14', () =>
        require('@/theme/assets/stickers/Cat-1/13-1.thumb128.png'),
      ),
      createSticker('cat-1', 14, 'Cat 15', () =>
        require('@/theme/assets/stickers/Cat-1/14-1.thumb128.png'),
      ),
      createSticker('cat-1', 15, 'Cat 16', () =>
        require('@/theme/assets/stickers/Cat-1/15-1.thumb128.png'),
      ),
      createSticker('cat-1', 16, 'Cat 17', () =>
        require('@/theme/assets/stickers/Cat-1/16-1.thumb128.png'),
      ),
      createSticker('cat-1', 17, 'Cat 18', () =>
        require('@/theme/assets/stickers/Cat-1/17-1.thumb128.png'),
      ),
      createSticker('cat-1', 18, 'Cat 19', () =>
        require('@/theme/assets/stickers/Cat-1/18-1.thumb128.png'),
      ),
      createSticker('cat-1', 19, 'Cat 20', () =>
        require('@/theme/assets/stickers/Cat-1/19-1.thumb128.png'),
      ),
    ],
  },
  {
    icon: '💰',
    id: 'crypto-1',
    name: 'Crypto',
    stickers: [
      createSticker('crypto-1', 0, 'Crypto 1', () =>
        require('@/theme/assets/stickers/Crypto-1/2c1c6c8a-78b7-4eeb-9c6a-a8404f35c394.webp'),
      ),
      createSticker('crypto-1', 1, 'Crypto 2', () =>
        require('@/theme/assets/stickers/Crypto-1/2e51b85f-9126-4143-8f83-f09f33f3f254.webp'),
      ),
      createSticker('crypto-1', 2, 'Crypto 3', () =>
        require('@/theme/assets/stickers/Crypto-1/3a99e2b3-93d8-4401-bb57-81111a3e997d.webp'),
      ),
      createSticker('crypto-1', 3, 'Crypto 4', () =>
        require('@/theme/assets/stickers/Crypto-1/4c085632-4aec-4e47-8d22-be2c1f6df00e.webp'),
      ),
      createSticker('crypto-1', 4, 'Crypto 5', () =>
        require('@/theme/assets/stickers/Crypto-1/6cf45e32-ae7e-41fe-81a2-e57fc80b9d71.webp'),
      ),
      createSticker('crypto-1', 5, 'Crypto 6', () =>
        require('@/theme/assets/stickers/Crypto-1/6f4e7d41-ac01-441b-b3af-dfe0a6c5459b.webp'),
      ),
      createSticker('crypto-1', 6, 'Crypto 7', () =>
        require('@/theme/assets/stickers/Crypto-1/8e3cc456-4165-4f0e-bf26-5be61b9a9f63.webp'),
      ),
      createSticker('crypto-1', 7, 'Crypto 8', () =>
        require('@/theme/assets/stickers/Crypto-1/9c287878-2e10-42c1-932e-32f674c133bd.webp'),
      ),
      createSticker('crypto-1', 8, 'Crypto 9', () =>
        require('@/theme/assets/stickers/Crypto-1/12efcb7b-39bb-48e5-848f-38b99ba27151.webp'),
      ),
      createSticker('crypto-1', 9, 'Crypto 10', () =>
        require('@/theme/assets/stickers/Crypto-1/47b8ac46-7d92-40ef-9453-838fe3ba3cc7.webp'),
      ),
      createSticker('crypto-1', 10, 'Crypto 11', () =>
        require('@/theme/assets/stickers/Crypto-1/47f784f8-a4e3-4d2a-bad0-8766b70be765.webp'),
      ),
      createSticker('crypto-1', 11, 'Crypto 12', () =>
        require('@/theme/assets/stickers/Crypto-1/70b5e064-5073-47c3-9c9b-11d9c20f1cfd.webp'),
      ),
      createSticker('crypto-1', 12, 'Crypto 13', () =>
        require('@/theme/assets/stickers/Crypto-1/78c3ca76-b3df-4f33-8cb9-a5d55821563b.webp'),
      ),
      createSticker('crypto-1', 13, 'Crypto 14', () =>
        require('@/theme/assets/stickers/Crypto-1/090aa984-2008-45d7-821f-fe6839c078ab.webp'),
      ),
      createSticker('crypto-1', 14, 'Crypto 15', () =>
        require('@/theme/assets/stickers/Crypto-1/593ec184-10a6-4e91-bde1-5ff842137cb7.webp'),
      ),
      createSticker('crypto-1', 15, 'Crypto 16', () =>
        require('@/theme/assets/stickers/Crypto-1/705fb087-f0c6-4d5a-a58c-b6baa19d1abe.webp'),
      ),
      createSticker('crypto-1', 16, 'Crypto 17', () =>
        require('@/theme/assets/stickers/Crypto-1/913f5a14-b710-41b9-8997-ac8635130ad8.webp'),
      ),
      createSticker('crypto-1', 17, 'Crypto 18', () =>
        require('@/theme/assets/stickers/Crypto-1/4350a022-ac76-4313-89ef-ca24c52ea594.webp'),
      ),
      createSticker('crypto-1', 18, 'Crypto 19', () =>
        require('@/theme/assets/stickers/Crypto-1/7413c245-0e6b-4793-9e63-7624b71ef799.webp'),
      ),
      createSticker('crypto-1', 19, 'Crypto 20', () =>
        require('@/theme/assets/stickers/Crypto-1/8312d3b4-7f16-4d79-ba1d-86b6f5e21003.webp'),
      ),
      createSticker('crypto-1', 20, 'Crypto 21', () =>
        require('@/theme/assets/stickers/Crypto-1/47843b3c-0cba-4f65-8296-3cb0fd2c4d6b.webp'),
      ),
      createSticker('crypto-1', 21, 'Crypto 22', () =>
        require('@/theme/assets/stickers/Crypto-1/2350221e-8313-4f49-8d2f-bde17d634aa2.webp'),
      ),
      createSticker('crypto-1', 22, 'Crypto 23', () =>
        require('@/theme/assets/stickers/Crypto-1/b7bf128e-55ad-4329-a7c7-d5eed11eea0e.webp'),
      ),
      createSticker('crypto-1', 23, 'Crypto 24', () =>
        require('@/theme/assets/stickers/Crypto-1/bf126119-d3f3-4a2a-b436-50d0294c333b.webp'),
      ),
      createSticker('crypto-1', 24, 'Crypto 25', () =>
        require('@/theme/assets/stickers/Crypto-1/c2a712c4-19e4-41a0-8cb5-232503e6ba5b.webp'),
      ),
      createSticker('crypto-1', 25, 'Crypto 26', () =>
        require('@/theme/assets/stickers/Crypto-1/c54071ff-dab6-4fa3-a107-a5992d57fbb0.webp'),
      ),
      createSticker('crypto-1', 26, 'Crypto 27', () =>
        require('@/theme/assets/stickers/Crypto-1/c54e36a8-ded3-4dfc-9169-377888ad7eb1.webp'),
      ),
      createSticker('crypto-1', 27, 'Crypto 28', () =>
        require('@/theme/assets/stickers/Crypto-1/c66ce02d-4fd7-487d-8b2e-4d7f3da096b4.webp'),
      ),
      createSticker('crypto-1', 28, 'Crypto 29', () =>
        require('@/theme/assets/stickers/Crypto-1/e5ede0cc-a59f-46ac-95d3-584029c48230.webp'),
      ),
      createSticker('crypto-1', 29, 'Crypto 30', () =>
        require('@/theme/assets/stickers/Crypto-1/ea4acb1d-1c3b-41c4-a78c-229ba137092f.webp'),
      ),
    ],
  },
  {
    icon: '🐊',
    id: 'cubigator-2',
    name: 'Cubigator',
    stickers: [
      createSticker('cubigator-2', 0, 'Cubigator 1', () =>
        require('@/theme/assets/stickers/Cubigator-2/0.thumb128.webp'),
      ),
      createSticker('cubigator-2', 1, 'Cubigator 2', () =>
        require('@/theme/assets/stickers/Cubigator-2/1.thumb128.webp'),
      ),
      createSticker('cubigator-2', 2, 'Cubigator 3', () =>
        require('@/theme/assets/stickers/Cubigator-2/2.thumb128.webp'),
      ),
      createSticker('cubigator-2', 3, 'Cubigator 4', () =>
        require('@/theme/assets/stickers/Cubigator-2/3.thumb128.webp'),
      ),
      createSticker('cubigator-2', 4, 'Cubigator 5', () =>
        require('@/theme/assets/stickers/Cubigator-2/4.thumb128.webp'),
      ),
      createSticker('cubigator-2', 5, 'Cubigator 6', () =>
        require('@/theme/assets/stickers/Cubigator-2/5.thumb128.webp'),
      ),
      createSticker('cubigator-2', 6, 'Cubigator 7', () =>
        require('@/theme/assets/stickers/Cubigator-2/6.thumb128.webp'),
      ),
      createSticker('cubigator-2', 7, 'Cubigator 8', () =>
        require('@/theme/assets/stickers/Cubigator-2/7.thumb128.webp'),
      ),
      createSticker('cubigator-2', 8, 'Cubigator 9', () =>
        require('@/theme/assets/stickers/Cubigator-2/8.thumb128.webp'),
      ),
      createSticker('cubigator-2', 9, 'Cubigator 10', () =>
        require('@/theme/assets/stickers/Cubigator-2/9.thumb128.webp'),
      ),
      createSticker('cubigator-2', 10, 'Cubigator 11', () =>
        require('@/theme/assets/stickers/Cubigator-2/10.thumb128.webp'),
      ),
      createSticker('cubigator-2', 11, 'Cubigator 12', () =>
        require('@/theme/assets/stickers/Cubigator-2/11.thumb128.webp'),
      ),
      createSticker('cubigator-2', 12, 'Cubigator 13', () =>
        require('@/theme/assets/stickers/Cubigator-2/12.thumb128.webp'),
      ),
      createSticker('cubigator-2', 13, 'Cubigator 14', () =>
        require('@/theme/assets/stickers/Cubigator-2/13.thumb128.webp'),
      ),
      createSticker('cubigator-2', 14, 'Cubigator 15', () =>
        require('@/theme/assets/stickers/Cubigator-2/14.thumb128.webp'),
      ),
      createSticker('cubigator-2', 15, 'Cubigator 16', () =>
        require('@/theme/assets/stickers/Cubigator-2/15.thumb128.webp'),
      ),
      createSticker('cubigator-2', 16, 'Cubigator 17', () =>
        require('@/theme/assets/stickers/Cubigator-2/16.thumb128.webp'),
      ),
      createSticker('cubigator-2', 17, 'Cubigator 18', () =>
        require('@/theme/assets/stickers/Cubigator-2/17.thumb128.webp'),
      ),
      createSticker('cubigator-2', 18, 'Cubigator 19', () =>
        require('@/theme/assets/stickers/Cubigator-2/18.thumb128.webp'),
      ),
      createSticker('cubigator-2', 19, 'Cubigator 20', () =>
        require('@/theme/assets/stickers/Cubigator-2/19.thumb128.webp'),
      ),
      createSticker('cubigator-2', 20, 'Cubigator 21', () =>
        require('@/theme/assets/stickers/Cubigator-2/20.thumb128.webp'),
      ),
      createSticker('cubigator-2', 21, 'Cubigator 22', () =>
        require('@/theme/assets/stickers/Cubigator-2/21.thumb128.webp'),
      ),
      createSticker('cubigator-2', 22, 'Cubigator 23', () =>
        require('@/theme/assets/stickers/Cubigator-2/22.thumb128.webp'),
      ),
      createSticker('cubigator-2', 23, 'Cubigator 24', () =>
        require('@/theme/assets/stickers/Cubigator-2/23.thumb128.webp'),
      ),
    ],
  },
  {
    icon: '🦸',
    id: 'hero-academy',
    name: 'Hero Academy',
    stickers: [
      createSticker('hero-academy', 0, 'Hero Academy 1', () =>
        require('@/theme/assets/stickers/Hero-Academy/0-1.thumb128.png'),
      ),
      createSticker('hero-academy', 1, 'Hero Academy 2', () =>
        require('@/theme/assets/stickers/Hero-Academy/1-1.thumb128.png'),
      ),
      createSticker('hero-academy', 2, 'Hero Academy 3', () =>
        require('@/theme/assets/stickers/Hero-Academy/2-1.thumb128.png'),
      ),
      createSticker('hero-academy', 3, 'Hero Academy 4', () =>
        require('@/theme/assets/stickers/Hero-Academy/3-1.thumb128.png'),
      ),
      createSticker('hero-academy', 4, 'Hero Academy 5', () =>
        require('@/theme/assets/stickers/Hero-Academy/4-1.thumb128.png'),
      ),
      createSticker('hero-academy', 5, 'Hero Academy 6', () =>
        require('@/theme/assets/stickers/Hero-Academy/5-1.thumb128.png'),
      ),
      createSticker('hero-academy', 6, 'Hero Academy 7', () =>
        require('@/theme/assets/stickers/Hero-Academy/6-1.thumb128.png'),
      ),
      createSticker('hero-academy', 7, 'Hero Academy 8', () =>
        require('@/theme/assets/stickers/Hero-Academy/7-1.thumb128.png'),
      ),
      createSticker('hero-academy', 8, 'Hero Academy 9', () =>
        require('@/theme/assets/stickers/Hero-Academy/8-1.thumb128.png'),
      ),
      createSticker('hero-academy', 9, 'Hero Academy 10', () =>
        require('@/theme/assets/stickers/Hero-Academy/9-1.thumb128.png'),
      ),
      createSticker('hero-academy', 10, 'Hero Academy 11', () =>
        require('@/theme/assets/stickers/Hero-Academy/10-1.thumb128.png'),
      ),
      createSticker('hero-academy', 11, 'Hero Academy 12', () =>
        require('@/theme/assets/stickers/Hero-Academy/11-1.thumb128.png'),
      ),
      createSticker('hero-academy', 12, 'Hero Academy 13', () =>
        require('@/theme/assets/stickers/Hero-Academy/12-1.thumb128.png'),
      ),
      createSticker('hero-academy', 13, 'Hero Academy 14', () =>
        require('@/theme/assets/stickers/Hero-Academy/13-1.thumb128.png'),
      ),
      createSticker('hero-academy', 14, 'Hero Academy 15', () =>
        require('@/theme/assets/stickers/Hero-Academy/14-1.thumb128.png'),
      ),
      createSticker('hero-academy', 15, 'Hero Academy 16', () =>
        require('@/theme/assets/stickers/Hero-Academy/15-1.thumb128.png'),
      ),
      createSticker('hero-academy', 16, 'Hero Academy 17', () =>
        require('@/theme/assets/stickers/Hero-Academy/16-1.thumb128.png'),
      ),
      createSticker('hero-academy', 17, 'Hero Academy 18', () =>
        require('@/theme/assets/stickers/Hero-Academy/17-1.thumb128.png'),
      ),
      createSticker('hero-academy', 18, 'Hero Academy 19', () =>
        require('@/theme/assets/stickers/Hero-Academy/18-1.thumb128.png'),
      ),
      createSticker('hero-academy', 19, 'Hero Academy 20', () =>
        require('@/theme/assets/stickers/Hero-Academy/19-1.thumb128.png'),
      ),
      createSticker('hero-academy', 20, 'Hero Academy 21', () =>
        require('@/theme/assets/stickers/Hero-Academy/20-1.thumb128.png'),
      ),
      createSticker('hero-academy', 21, 'Hero Academy 22', () =>
        require('@/theme/assets/stickers/Hero-Academy/21-1.thumb128.png'),
      ),
      createSticker('hero-academy', 22, 'Hero Academy 23', () =>
        require('@/theme/assets/stickers/Hero-Academy/22-1.thumb128.png'),
      ),
      createSticker('hero-academy', 23, 'Hero Academy 24', () =>
        require('@/theme/assets/stickers/Hero-Academy/23-1.thumb128.png'),
      ),
    ],
  },
  {
    icon: '📷',
    id: 'insta-1',
    name: 'Insta',
    stickers: [
      createSticker('insta-1', 0, 'Insta 1', () =>
        require('@/theme/assets/stickers/Insta-1/0-1.thumb128.png'),
      ),
      createSticker('insta-1', 1, 'Insta 2', () =>
        require('@/theme/assets/stickers/Insta-1/1-6.thumb128.png'),
      ),
      createSticker('insta-1', 2, 'Insta 3', () =>
        require('@/theme/assets/stickers/Insta-1/2-1.thumb128.png'),
      ),
      createSticker('insta-1', 3, 'Insta 4', () =>
        require('@/theme/assets/stickers/Insta-1/3-3.thumb128.png'),
      ),
      createSticker('insta-1', 4, 'Insta 5', () =>
        require('@/theme/assets/stickers/Insta-1/4-1.thumb128.png'),
      ),
      createSticker('insta-1', 5, 'Insta 6', () =>
        require('@/theme/assets/stickers/Insta-1/5-1.thumb128.png'),
      ),
      createSticker('insta-1', 6, 'Insta 7', () =>
        require('@/theme/assets/stickers/Insta-1/6-1.thumb128.png'),
      ),
      createSticker('insta-1', 7, 'Insta 8', () =>
        require('@/theme/assets/stickers/Insta-1/7-1.thumb128.png'),
      ),
      createSticker('insta-1', 8, 'Insta 9', () =>
        require('@/theme/assets/stickers/Insta-1/8-1.thumb128.png'),
      ),
      createSticker('insta-1', 9, 'Insta 10', () =>
        require('@/theme/assets/stickers/Insta-1/9-1.thumb128.png'),
      ),
      createSticker('insta-1', 10, 'Insta 11', () =>
        require('@/theme/assets/stickers/Insta-1/9-2.thumb128.png'),
      ),
      createSticker('insta-1', 11, 'Insta 12', () =>
        require('@/theme/assets/stickers/Insta-1/10-1.thumb128.png'),
      ),
      createSticker('insta-1', 12, 'Insta 13', () =>
        require('@/theme/assets/stickers/Insta-1/12-1.thumb128.png'),
      ),
      createSticker('insta-1', 13, 'Insta 14', () =>
        require('@/theme/assets/stickers/Insta-1/12-3.thumb128.png'),
      ),
      createSticker('insta-1', 14, 'Insta 15', () =>
        require('@/theme/assets/stickers/Insta-1/13-1.thumb128.png'),
      ),
      createSticker('insta-1', 15, 'Insta 16', () =>
        require('@/theme/assets/stickers/Insta-1/14-1.thumb128.png'),
      ),
      createSticker('insta-1', 16, 'Insta 17', () =>
        require('@/theme/assets/stickers/Insta-1/14-2.thumb128.png'),
      ),
      createSticker('insta-1', 17, 'Insta 18', () =>
        require('@/theme/assets/stickers/Insta-1/15-1.thumb128.png'),
      ),
      createSticker('insta-1', 18, 'Insta 19', () =>
        require('@/theme/assets/stickers/Insta-1/16-1.thumb128.png'),
      ),
      createSticker('insta-1', 19, 'Insta 20', () =>
        require('@/theme/assets/stickers/Insta-1/17-1.thumb128.png'),
      ),
      createSticker('insta-1', 20, 'Insta 21', () =>
        require('@/theme/assets/stickers/Insta-1/18-1.thumb128.png'),
      ),
      createSticker('insta-1', 21, 'Insta 22', () =>
        require('@/theme/assets/stickers/Insta-1/19-1.thumb128.png'),
      ),
      createSticker('insta-1', 22, 'Insta 23', () =>
        require('@/theme/assets/stickers/Insta-1/22-3.thumb128.png'),
      ),
      createSticker('insta-1', 23, 'Insta 24', () =>
        require('@/theme/assets/stickers/Insta-1/23-3.thumb128.png'),
      ),
    ],
  },
  {
    icon: '💪',
    id: 'johnny-bravo',
    name: 'Johnny Bravo',
    stickers: [
      createSticker('johnny-bravo', 0, 'Johnny Bravo 1', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/0fe1012f-96bb-4121-948f-62bb4b3bb7ca.webp'),
      ),
      createSticker('johnny-bravo', 1, 'Johnny Bravo 2', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/2b5d5dba-7603-49bd-8b63-99b3c813ad32.webp'),
      ),
      createSticker('johnny-bravo', 2, 'Johnny Bravo 3', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/3ece6a28-0221-4b53-879a-fc55c296d36e.webp'),
      ),
      createSticker('johnny-bravo', 3, 'Johnny Bravo 4', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/6a49948f-5c80-4992-8163-a7df4ceb8dc2.webp'),
      ),
      createSticker('johnny-bravo', 4, 'Johnny Bravo 5', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/6ca93364-d0d9-4ace-9877-ba0669981632.webp'),
      ),
      createSticker('johnny-bravo', 5, 'Johnny Bravo 6', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/6e50d47a-928c-4274-8d98-13cf55db8b73.webp'),
      ),
      createSticker('johnny-bravo', 6, 'Johnny Bravo 7', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/9d4cbc7e-fbd1-41d2-b5e9-719245e98a11.webp'),
      ),
      createSticker('johnny-bravo', 7, 'Johnny Bravo 8', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/11d0b4c4-f954-47a2-90de-188aeb734a5d.webp'),
      ),
      createSticker('johnny-bravo', 8, 'Johnny Bravo 9', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/18c15207-1af9-40fe-865d-1016b9e22a6d.webp'),
      ),
      createSticker('johnny-bravo', 9, 'Johnny Bravo 10', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/40e37612-3ac6-43e2-8d44-69de91f017b0.webp'),
      ),
      createSticker('johnny-bravo', 10, 'Johnny Bravo 11', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/47a79d68-456b-4ed7-84e8-5a712167378c.webp'),
      ),
      createSticker('johnny-bravo', 11, 'Johnny Bravo 12', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/62cb912a-d9b2-4c9e-8a2b-ab403d0beb32.webp'),
      ),
      createSticker('johnny-bravo', 12, 'Johnny Bravo 13', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/78acec91-909a-4b64-97d2-bd78e4b2d9de.webp'),
      ),
      createSticker('johnny-bravo', 13, 'Johnny Bravo 14', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/143c3c96-8b32-4025-bd95-5806ece20438.webp'),
      ),
      createSticker('johnny-bravo', 14, 'Johnny Bravo 15', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/1979a433-c5b4-4041-b40d-0f1b3a9ad50c.webp'),
      ),
      createSticker('johnny-bravo', 15, 'Johnny Bravo 16', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/8645afc1-39e2-4769-8704-d4112a901b57.webp'),
      ),
      createSticker('johnny-bravo', 16, 'Johnny Bravo 17', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/a7c968d1-008c-41dd-99b7-a3171bb087e0.webp'),
      ),
      createSticker('johnny-bravo', 17, 'Johnny Bravo 18', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/be09de48-d5ae-4310-b92c-2c29bded9047.webp'),
      ),
      createSticker('johnny-bravo', 18, 'Johnny Bravo 19', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/d246fa17-c725-4e8c-8552-e9bfdc8baee2.webp'),
      ),
      createSticker('johnny-bravo', 19, 'Johnny Bravo 20', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/db0b0c35-89dd-4a79-8070-65b7beef1362.webp'),
      ),
      createSticker('johnny-bravo', 20, 'Johnny Bravo 21', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/dfc96932-8d84-4ab2-adae-2eb4f6d49ee7.webp'),
      ),
      createSticker('johnny-bravo', 21, 'Johnny Bravo 22', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/e04725ec-d114-45a9-81c7-0894739598d8.webp'),
      ),
      createSticker('johnny-bravo', 22, 'Johnny Bravo 23', () =>
        require('@/theme/assets/stickers/Johnny-Bravo/e1b79b65-68d1-42cd-9b5e-a6ca042856f9.webp'),
      ),
    ],
  },
  {
    icon: '❤️',
    id: 'love-1',
    name: 'Love',
    stickers: [
      createSticker('love-1', 0, 'Love 1', () =>
        require('@/theme/assets/stickers/Love-1/0.thumb128.webp'),
      ),
      createSticker('love-1', 1, 'Love 2', () =>
        require('@/theme/assets/stickers/Love-1/1.thumb128.webp'),
      ),
      createSticker('love-1', 2, 'Love 3', () =>
        require('@/theme/assets/stickers/Love-1/2.thumb128.webp'),
      ),
      createSticker('love-1', 3, 'Love 4', () =>
        require('@/theme/assets/stickers/Love-1/3.thumb128.webp'),
      ),
      createSticker('love-1', 4, 'Love 5', () =>
        require('@/theme/assets/stickers/Love-1/4.thumb128.webp'),
      ),
      createSticker('love-1', 5, 'Love 6', () =>
        require('@/theme/assets/stickers/Love-1/5.thumb128.webp'),
      ),
      createSticker('love-1', 6, 'Love 7', () =>
        require('@/theme/assets/stickers/Love-1/6.thumb128.webp'),
      ),
      createSticker('love-1', 7, 'Love 8', () =>
        require('@/theme/assets/stickers/Love-1/7.thumb128.webp'),
      ),
      createSticker('love-1', 8, 'Love 9', () =>
        require('@/theme/assets/stickers/Love-1/8.thumb128.webp'),
      ),
      createSticker('love-1', 9, 'Love 10', () =>
        require('@/theme/assets/stickers/Love-1/9.thumb128.webp'),
      ),
      createSticker('love-1', 10, 'Love 11', () =>
        require('@/theme/assets/stickers/Love-1/10.thumb128.webp'),
      ),
      createSticker('love-1', 11, 'Love 12', () =>
        require('@/theme/assets/stickers/Love-1/11.thumb128.webp'),
      ),
      createSticker('love-1', 12, 'Love 13', () =>
        require('@/theme/assets/stickers/Love-1/12.thumb128.webp'),
      ),
      createSticker('love-1', 13, 'Love 14', () =>
        require('@/theme/assets/stickers/Love-1/13.thumb128.webp'),
      ),
      createSticker('love-1', 14, 'Love 15', () =>
        require('@/theme/assets/stickers/Love-1/14.thumb128.webp'),
      ),
      createSticker('love-1', 15, 'Love 16', () =>
        require('@/theme/assets/stickers/Love-1/15.thumb128.webp'),
      ),
      createSticker('love-1', 16, 'Love 17', () =>
        require('@/theme/assets/stickers/Love-1/16.thumb128.webp'),
      ),
      createSticker('love-1', 17, 'Love 18', () =>
        require('@/theme/assets/stickers/Love-1/17.thumb128.webp'),
      ),
      createSticker('love-1', 18, 'Love 19', () =>
        require('@/theme/assets/stickers/Love-1/18.thumb128.webp'),
      ),
      createSticker('love-1', 19, 'Love 20', () =>
        require('@/theme/assets/stickers/Love-1/19.thumb128.webp'),
      ),
      createSticker('love-1', 20, 'Love 21', () =>
        require('@/theme/assets/stickers/Love-1/20.thumb128.webp'),
      ),
      createSticker('love-1', 21, 'Love 22', () =>
        require('@/theme/assets/stickers/Love-1/21.thumb128.webp'),
      ),
      createSticker('love-1', 22, 'Love 23', () =>
        require('@/theme/assets/stickers/Love-1/22.thumb128.webp'),
      ),
      createSticker('love-1', 23, 'Love 24', () =>
        require('@/theme/assets/stickers/Love-1/23.thumb128.webp'),
      ),
    ],
  },
  {
    icon: '❤️',
    id: 'love-2',
    name: 'Love 2',
    stickers: [
      createSticker('love-2', 0, 'Love 2 1', () =>
        require('@/theme/assets/stickers/Love-2/0.thumb128.webp'),
      ),
      createSticker('love-2', 1, 'Love 2 2', () =>
        require('@/theme/assets/stickers/Love-2/1.thumb128.webp'),
      ),
      createSticker('love-2', 2, 'Love 2 3', () =>
        require('@/theme/assets/stickers/Love-2/2.thumb128.webp'),
      ),
      createSticker('love-2', 3, 'Love 2 4', () =>
        require('@/theme/assets/stickers/Love-2/3.thumb128.webp'),
      ),
      createSticker('love-2', 4, 'Love 2 5', () =>
        require('@/theme/assets/stickers/Love-2/4.thumb128.webp'),
      ),
      createSticker('love-2', 5, 'Love 2 6', () =>
        require('@/theme/assets/stickers/Love-2/5.thumb128.webp'),
      ),
      createSticker('love-2', 6, 'Love 2 7', () =>
        require('@/theme/assets/stickers/Love-2/6.thumb128.webp'),
      ),
      createSticker('love-2', 7, 'Love 2 8', () =>
        require('@/theme/assets/stickers/Love-2/7.thumb128.webp'),
      ),
      createSticker('love-2', 8, 'Love 2 9', () =>
        require('@/theme/assets/stickers/Love-2/8.thumb128.webp'),
      ),
      createSticker('love-2', 9, 'Love 2 10', () =>
        require('@/theme/assets/stickers/Love-2/9.thumb128.webp'),
      ),
      createSticker('love-2', 10, 'Love 2 11', () =>
        require('@/theme/assets/stickers/Love-2/10.thumb128.webp'),
      ),
      createSticker('love-2', 11, 'Love 2 12', () =>
        require('@/theme/assets/stickers/Love-2/11.thumb128.webp'),
      ),
      createSticker('love-2', 12, 'Love 2 13', () =>
        require('@/theme/assets/stickers/Love-2/12.thumb128.webp'),
      ),
      createSticker('love-2', 13, 'Love 2 14', () =>
        require('@/theme/assets/stickers/Love-2/13.thumb128.webp'),
      ),
      createSticker('love-2', 14, 'Love 2 15', () =>
        require('@/theme/assets/stickers/Love-2/14.thumb128.webp'),
      ),
      createSticker('love-2', 15, 'Love 2 16', () =>
        require('@/theme/assets/stickers/Love-2/15.thumb128.webp'),
      ),
      createSticker('love-2', 16, 'Love 2 17', () =>
        require('@/theme/assets/stickers/Love-2/16.thumb128.webp'),
      ),
      createSticker('love-2', 17, 'Love 2 18', () =>
        require('@/theme/assets/stickers/Love-2/17.thumb128.webp'),
      ),
      createSticker('love-2', 18, 'Love 2 19', () =>
        require('@/theme/assets/stickers/Love-2/18.thumb128.webp'),
      ),
      createSticker('love-2', 19, 'Love 2 20', () =>
        require('@/theme/assets/stickers/Love-2/19.thumb128.webp'),
      ),
      createSticker('love-2', 20, 'Love 2 21', () =>
        require('@/theme/assets/stickers/Love-2/20.thumb128.webp'),
      ),
      createSticker('love-2', 21, 'Love 2 22', () =>
        require('@/theme/assets/stickers/Love-2/21.thumb128.webp'),
      ),
      createSticker('love-2', 22, 'Love 2 23', () =>
        require('@/theme/assets/stickers/Love-2/22.thumb128.webp'),
      ),
      createSticker('love-2', 23, 'Love 2 24', () =>
        require('@/theme/assets/stickers/Love-2/23.thumb128.webp'),
      ),
    ],
  },
  {
    icon: '🔥',
    id: 'meme-1',
    name: 'Meme',
    stickers: [
      createSticker('meme-1', 0, 'Meme 1', () =>
        require('@/theme/assets/stickers/Meme-1/2dd37e1e-28e0-4d78-a079-4ae06d6cf68f.webp'),
      ),
      createSticker('meme-1', 1, 'Meme 2', () =>
        require('@/theme/assets/stickers/Meme-1/2e2ad587-77ca-44a3-a640-5d3bb4f404cb.webp'),
      ),
      createSticker('meme-1', 2, 'Meme 3', () =>
        require('@/theme/assets/stickers/Meme-1/5a118027-70c0-44c5-8a1c-602d0f65b32a.webp'),
      ),
      createSticker('meme-1', 3, 'Meme 4', () =>
        require('@/theme/assets/stickers/Meme-1/6bd17371-cae0-4592-99f2-f616a67a877e.webp'),
      ),
      createSticker('meme-1', 4, 'Meme 5', () =>
        require('@/theme/assets/stickers/Meme-1/9eebb3e7-9c66-4446-a6bf-5237cb823f3c.webp'),
      ),
      createSticker('meme-1', 5, 'Meme 6', () =>
        require('@/theme/assets/stickers/Meme-1/14f68d0b-3f45-45a4-9b90-0748fbc2b366.webp'),
      ),
      createSticker('meme-1', 6, 'Meme 7', () =>
        require('@/theme/assets/stickers/Meme-1/40c742d4-0cf0-435d-81cb-5feba046b180.webp'),
      ),
      createSticker('meme-1', 7, 'Meme 8', () =>
        require('@/theme/assets/stickers/Meme-1/46e52050-e7fc-47d6-9201-ccecc04ce8d1.webp'),
      ),
      createSticker('meme-1', 8, 'Meme 9', () =>
        require('@/theme/assets/stickers/Meme-1/54e16db7-c136-4afe-8cdb-7b1e1224570d.webp'),
      ),
      createSticker('meme-1', 9, 'Meme 10', () =>
        require('@/theme/assets/stickers/Meme-1/68fc91d5-6e4f-4068-b960-0d77df1d246b.webp'),
      ),
      createSticker('meme-1', 10, 'Meme 11', () =>
        require('@/theme/assets/stickers/Meme-1/73d4a7ad-8995-41f5-8578-56517a0be400.webp'),
      ),
      createSticker('meme-1', 11, 'Meme 12', () =>
        require('@/theme/assets/stickers/Meme-1/2010bcb5-4e00-4986-bfb6-2403294057b7.webp'),
      ),
      createSticker('meme-1', 12, 'Meme 13', () =>
        require('@/theme/assets/stickers/Meme-1/2540e746-bc70-4754-9342-8ca277977988.webp'),
      ),
      createSticker('meme-1', 13, 'Meme 14', () =>
        require('@/theme/assets/stickers/Meme-1/43761a10-6666-46f7-9914-c98d0e55f5ff.webp'),
      ),
      createSticker('meme-1', 14, 'Meme 15', () =>
        require('@/theme/assets/stickers/Meme-1/90709f84-253a-4617-be2f-20274d63bd7d.webp'),
      ),
      createSticker('meme-1', 15, 'Meme 16', () =>
        require('@/theme/assets/stickers/Meme-1/b4769d3c-bcdf-4ad1-81fa-69d675d5c02b.webp'),
      ),
      createSticker('meme-1', 16, 'Meme 17', () =>
        require('@/theme/assets/stickers/Meme-1/c1514a24-63ae-4e4f-8867-606ed3311858.webp'),
      ),
      createSticker('meme-1', 17, 'Meme 18', () =>
        require('@/theme/assets/stickers/Meme-1/c5d02e41-bec9-44e5-bb96-5955a24a0ee3.webp'),
      ),
      createSticker('meme-1', 18, 'Meme 19', () =>
        require('@/theme/assets/stickers/Meme-1/c6f30161-da68-4b06-83cf-4285529b2092.webp'),
      ),
      createSticker('meme-1', 19, 'Meme 20', () =>
        require('@/theme/assets/stickers/Meme-1/cae562a4-17aa-423f-99c3-68fe7968673c.webp'),
      ),
      createSticker('meme-1', 20, 'Meme 21', () =>
        require('@/theme/assets/stickers/Meme-1/cc4449d4-c739-4b51-9cd9-fd15694787eb.webp'),
      ),
      createSticker('meme-1', 21, 'Meme 22', () =>
        require('@/theme/assets/stickers/Meme-1/cd0e5f83-5f03-4359-8f77-7c23f9066253.webp'),
      ),
      createSticker('meme-1', 22, 'Meme 23', () =>
        require('@/theme/assets/stickers/Meme-1/d0f57842-c1c7-4dfc-bfbe-4519558a695c.webp'),
      ),
      createSticker('meme-1', 23, 'Meme 24', () =>
        require('@/theme/assets/stickers/Meme-1/d50db928-5558-4559-aacc-d9cdfd9c8177.webp'),
      ),
      createSticker('meme-1', 24, 'Meme 25', () =>
        require('@/theme/assets/stickers/Meme-1/de0786dd-c26b-40d6-82b5-436731731bf2.webp'),
      ),
      createSticker('meme-1', 25, 'Meme 26', () =>
        require('@/theme/assets/stickers/Meme-1/deed0f42-6718-457a-94f9-c53eb29b9c0d.webp'),
      ),
      createSticker('meme-1', 26, 'Meme 27', () =>
        require('@/theme/assets/stickers/Meme-1/eab43928-8bef-475a-b4b8-c57ddb5422ef.webp'),
      ),
      createSticker('meme-1', 27, 'Meme 28', () =>
        require('@/theme/assets/stickers/Meme-1/edbff4e1-544e-4ead-8b1b-8fad64f90a0a.webp'),
      ),
      createSticker('meme-1', 28, 'Meme 29', () =>
        require('@/theme/assets/stickers/Meme-1/f2fd9cc1-66e4-4384-9c45-3e4ba7d0afe6.webp'),
      ),
      createSticker('meme-1', 29, 'Meme 30', () =>
        require('@/theme/assets/stickers/Meme-1/fb1e5ba5-e3e2-455b-a6c5-108e722eca57.webp'),
      ),
    ],
  },
  {
    icon: '🔥',
    id: 'meme-2',
    name: 'Meme 2',
    stickers: [
      createSticker('meme-2', 0, 'Meme 2 1', () =>
        require('@/theme/assets/stickers/Meme-2/0-1.thumb128.webp'),
      ),
      createSticker('meme-2', 1, 'Meme 2 2', () =>
        require('@/theme/assets/stickers/Meme-2/1-1.thumb128.webp'),
      ),
      createSticker('meme-2', 2, 'Meme 2 3', () =>
        require('@/theme/assets/stickers/Meme-2/2-1.thumb128.webp'),
      ),
      createSticker('meme-2', 3, 'Meme 2 4', () =>
        require('@/theme/assets/stickers/Meme-2/3-1.thumb128.webp'),
      ),
      createSticker('meme-2', 4, 'Meme 2 5', () =>
        require('@/theme/assets/stickers/Meme-2/4-1.thumb128.webp'),
      ),
      createSticker('meme-2', 5, 'Meme 2 6', () =>
        require('@/theme/assets/stickers/Meme-2/5-1.thumb128.webp'),
      ),
      createSticker('meme-2', 6, 'Meme 2 7', () =>
        require('@/theme/assets/stickers/Meme-2/6-1.thumb128.webp'),
      ),
      createSticker('meme-2', 7, 'Meme 2 8', () =>
        require('@/theme/assets/stickers/Meme-2/7-1.thumb128.webp'),
      ),
      createSticker('meme-2', 8, 'Meme 2 9', () =>
        require('@/theme/assets/stickers/Meme-2/8-1.thumb128.webp'),
      ),
      createSticker('meme-2', 9, 'Meme 2 10', () =>
        require('@/theme/assets/stickers/Meme-2/9-1.thumb128.webp'),
      ),
      createSticker('meme-2', 10, 'Meme 2 11', () =>
        require('@/theme/assets/stickers/Meme-2/10-1.thumb128.webp'),
      ),
      createSticker('meme-2', 11, 'Meme 2 12', () =>
        require('@/theme/assets/stickers/Meme-2/11-1.thumb128.webp'),
      ),
      createSticker('meme-2', 12, 'Meme 2 13', () =>
        require('@/theme/assets/stickers/Meme-2/12-1.thumb128.webp'),
      ),
      createSticker('meme-2', 13, 'Meme 2 14', () =>
        require('@/theme/assets/stickers/Meme-2/13-1.thumb128.webp'),
      ),
      createSticker('meme-2', 14, 'Meme 2 15', () =>
        require('@/theme/assets/stickers/Meme-2/14-1.thumb128.webp'),
      ),
      createSticker('meme-2', 15, 'Meme 2 16', () =>
        require('@/theme/assets/stickers/Meme-2/15-1.thumb128.webp'),
      ),
      createSticker('meme-2', 16, 'Meme 2 17', () =>
        require('@/theme/assets/stickers/Meme-2/16-1.thumb128.webp'),
      ),
      createSticker('meme-2', 17, 'Meme 2 18', () =>
        require('@/theme/assets/stickers/Meme-2/17-1.thumb128.webp'),
      ),
      createSticker('meme-2', 18, 'Meme 2 19', () =>
        require('@/theme/assets/stickers/Meme-2/18-1.thumb128.webp'),
      ),
      createSticker('meme-2', 19, 'Meme 2 20', () =>
        require('@/theme/assets/stickers/Meme-2/19-1.thumb128.webp'),
      ),
      createSticker('meme-2', 20, 'Meme 2 21', () =>
        require('@/theme/assets/stickers/Meme-2/20-1.thumb128.webp'),
      ),
      createSticker('meme-2', 21, 'Meme 2 22', () =>
        require('@/theme/assets/stickers/Meme-2/21-1.thumb128.webp'),
      ),
      createSticker('meme-2', 22, 'Meme 2 23', () =>
        require('@/theme/assets/stickers/Meme-2/22-1.thumb128.webp'),
      ),
      createSticker('meme-2', 23, 'Meme 2 24', () =>
        require('@/theme/assets/stickers/Meme-2/23-1.thumb128.webp'),
      ),
    ],
  },
  {
    icon: '🐸',
    id: 'pepe-1',
    name: 'PEPE',
    stickers: [
      createSticker('pepe-1', 0, 'PEPE 1', () =>
        require('@/theme/assets/stickers/PEPE-1/0ef9cf61-249a-44ae-96aa-2a861f5148f2.webp'),
      ),
      createSticker('pepe-1', 1, 'PEPE 2', () =>
        require('@/theme/assets/stickers/PEPE-1/1e30d16e-24a8-448f-a925-b3c543ae71bb.webp'),
      ),
      createSticker('pepe-1', 2, 'PEPE 3', () =>
        require('@/theme/assets/stickers/PEPE-1/5a31e4b9-2525-4bda-b553-a078f3749ac5.webp'),
      ),
      createSticker('pepe-1', 3, 'PEPE 4', () =>
        require('@/theme/assets/stickers/PEPE-1/8d342fc2-9ecc-46b6-a81c-d338d432491f.webp'),
      ),
      createSticker('pepe-1', 4, 'PEPE 5', () =>
        require('@/theme/assets/stickers/PEPE-1/9bede514-72e1-4c06-9061-9df1fde9dad6.webp'),
      ),
      createSticker('pepe-1', 5, 'PEPE 6', () =>
        require('@/theme/assets/stickers/PEPE-1/34b956ec-15fd-4b97-9303-10c9652f6ef1.webp'),
      ),
      createSticker('pepe-1', 6, 'PEPE 7', () =>
        require('@/theme/assets/stickers/PEPE-1/85ff12cb-56fe-4117-9bae-7fc81cb279d3.webp'),
      ),
      createSticker('pepe-1', 7, 'PEPE 8', () =>
        require('@/theme/assets/stickers/PEPE-1/117b0749-4741-4700-b3d8-de085c19246a.webp'),
      ),
      createSticker('pepe-1', 8, 'PEPE 9', () =>
        require('@/theme/assets/stickers/PEPE-1/472b5575-064b-46c8-9ff3-863a9a3ee0d2.webp'),
      ),
      createSticker('pepe-1', 9, 'PEPE 10', () =>
        require('@/theme/assets/stickers/PEPE-1/777aad1b-1d36-4200-b114-566a1f149e9b.webp'),
      ),
      createSticker('pepe-1', 10, 'PEPE 11', () =>
        require('@/theme/assets/stickers/PEPE-1/803c3add-329c-49b3-9240-2c1637a914f8.webp'),
      ),
      createSticker('pepe-1', 11, 'PEPE 12', () =>
        require('@/theme/assets/stickers/PEPE-1/0845a5d7-9672-4904-9342-35c6363ae6fe.webp'),
      ),
      createSticker('pepe-1', 12, 'PEPE 13', () =>
        require('@/theme/assets/stickers/PEPE-1/858b34e9-08c4-458b-bde2-14d101b2574e.webp'),
      ),
      createSticker('pepe-1', 13, 'PEPE 14', () =>
        require('@/theme/assets/stickers/PEPE-1/7483e4e2-6d00-4fdd-8ae5-fdf7d1164a2c.webp'),
      ),
      createSticker('pepe-1', 14, 'PEPE 15', () =>
        require('@/theme/assets/stickers/PEPE-1/3319537a-faa6-458b-9135-572d24480bc7.webp'),
      ),
      createSticker('pepe-1', 15, 'PEPE 16', () =>
        require('@/theme/assets/stickers/PEPE-1/a4e41156-4334-4d1a-8892-0f6680b91111.webp'),
      ),
      createSticker('pepe-1', 16, 'PEPE 17', () =>
        require('@/theme/assets/stickers/PEPE-1/ab0a2ecb-7c0f-429a-82df-99349771e5d6.webp'),
      ),
      createSticker('pepe-1', 17, 'PEPE 18', () =>
        require('@/theme/assets/stickers/PEPE-1/ad02fb1a-4b4b-4087-b11e-b81c9dbde1c4.webp'),
      ),
      createSticker('pepe-1', 18, 'PEPE 19', () =>
        require('@/theme/assets/stickers/PEPE-1/b39683cf-37f5-442a-a791-deddb3bb27de.webp'),
      ),
      createSticker('pepe-1', 19, 'PEPE 20', () =>
        require('@/theme/assets/stickers/PEPE-1/bb80c78b-606c-4257-8cb8-44d3e81919de.webp'),
      ),
      createSticker('pepe-1', 20, 'PEPE 21', () =>
        require('@/theme/assets/stickers/PEPE-1/c02522f7-e941-4027-b51e-285910aa86be.webp'),
      ),
      createSticker('pepe-1', 21, 'PEPE 22', () =>
        require('@/theme/assets/stickers/PEPE-1/c323376b-260c-46e4-a03f-09da02e20eb5.webp'),
      ),
      createSticker('pepe-1', 22, 'PEPE 23', () =>
        require('@/theme/assets/stickers/PEPE-1/c8cc0537-c588-467a-b678-663b34db9aa6.webp'),
      ),
      createSticker('pepe-1', 23, 'PEPE 24', () =>
        require('@/theme/assets/stickers/PEPE-1/e15bb900-3676-45be-a635-5e4088cae9fc.webp'),
      ),
      createSticker('pepe-1', 24, 'PEPE 25', () =>
        require('@/theme/assets/stickers/PEPE-1/e817c4d0-3129-49f4-9d56-ccc803d36157.webp'),
      ),
      createSticker('pepe-1', 25, 'PEPE 26', () =>
        require('@/theme/assets/stickers/PEPE-1/eb2803c2-a28b-4aed-bb51-26df03ece85d.webp'),
      ),
      createSticker('pepe-1', 26, 'PEPE 27', () =>
        require('@/theme/assets/stickers/PEPE-1/f87c23fd-daab-426d-bf4e-f546caa5162e.webp'),
      ),
      createSticker('pepe-1', 27, 'PEPE 28', () =>
        require('@/theme/assets/stickers/PEPE-1/f9f34228-13d9-4323-b503-bca1d1478256.webp'),
      ),
    ],
  },
  {
    icon: '🐕',
    id: 'shiba',
    name: 'Shiba',
    stickers: [
      createSticker('shiba', 0, 'Shiba 1', () =>
        require('@/theme/assets/stickers/Shiba/1a9763fc-d367-4667-8aa8-0fb9a22a15f2.webp'),
      ),
      createSticker('shiba', 1, 'Shiba 2', () =>
        require('@/theme/assets/stickers/Shiba/3aebeac2-296e-4811-afb9-44f2b32906c6.webp'),
      ),
      createSticker('shiba', 2, 'Shiba 3', () =>
        require('@/theme/assets/stickers/Shiba/3df50381-2e9d-4360-aef4-44d417b4ff50.webp'),
      ),
      createSticker('shiba', 3, 'Shiba 4', () =>
        require('@/theme/assets/stickers/Shiba/6fefebcc-d6ca-4047-a856-ed6d36dc94ca.webp'),
      ),
      createSticker('shiba', 4, 'Shiba 5', () =>
        require('@/theme/assets/stickers/Shiba/9bf61379-4f10-479f-a751-fe06f37f43c2.webp'),
      ),
      createSticker('shiba', 5, 'Shiba 6', () =>
        require('@/theme/assets/stickers/Shiba/39dc78a5-1410-4b64-a523-abc331980074.webp'),
      ),
      createSticker('shiba', 6, 'Shiba 7', () =>
        require('@/theme/assets/stickers/Shiba/535f0ba0-af28-45f1-9871-f595e3a43b71.webp'),
      ),
      createSticker('shiba', 7, 'Shiba 8', () =>
        require('@/theme/assets/stickers/Shiba/a2d87706-9ecf-4af2-8f73-36daa2a677fd.webp'),
      ),
      createSticker('shiba', 8, 'Shiba 9', () =>
        require('@/theme/assets/stickers/Shiba/e7161677-5d02-4a87-a678-41c538254e7d.webp'),
      ),
      createSticker('shiba', 9, 'Shiba 10', () =>
        require('@/theme/assets/stickers/Shiba/fedbed1d-6680-4244-b4f4-97534fae58c7.webp'),
      ),
    ],
  },
]

// Convert to format expected by StickerPicker
export type Sticker = {
  readonly id: string
  readonly name: string
  readonly uri: ImageSourcePropType | string
}

export type StickerPack = {
  readonly icon: string
  readonly id: string
  readonly name: string
  readonly stickers: readonly Sticker[]
  readonly thumbnail?: ImageSourcePropType // First sticker image as thumbnail
}

// Convert sticker assets to sticker format
export const getStickerPacks = (): readonly StickerPack[] => {
  return STICKER_PACKS.map((pack) => ({
    icon: pack.icon,
    id: pack.id,
    name: pack.name,
    stickers: pack.stickers.map((sticker) => ({
      id: sticker.id,
      name: sticker.name,
      uri: sticker.source as ImageSourcePropType | string,
    })),
    thumbnail: pack.stickers.length > 0 ? pack.stickers[0].source : undefined,
  }))
}
