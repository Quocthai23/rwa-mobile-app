/**
 * Script to automatically generate stickerLoader.ts from sticker folders
 * Run: node scripts/generateStickers.js
 */

const fs = require('fs');
const path = require('path');

const STICKERS_DIR = path.join(__dirname, '../src/theme/assets/stickers');
const OUTPUT_FILE = path.join(__dirname, '../src/utils/stickerLoader.ts');

// Map folder names to display names and icons
const PACK_CONFIG = {
    'Baby-1': { name: 'Baby', icon: '👶' },
    'PEPE-1': { name: 'PEPE', icon: '🐸' },
    'Cat-1': { name: 'Cat', icon: '🐱' },
    'Meme-1': { name: 'Meme', icon: '🔥' },
    'Meme-2': { name: 'Meme 2', icon: '🔥' },
    'Love-1': { name: 'Love', icon: '❤️' },
    'Love-2': { name: 'Love 2', icon: '❤️' },
    'Crypto-1': { name: 'Crypto', icon: '💰' },
    'Cubigator-2': { name: 'Cubigator', icon: '🐊' },
    'Hero-Academy': { name: 'Hero Academy', icon: '🦸' },
    'Insta-1': { name: 'Insta', icon: '📷' },
    'Johnny-Bravo': { name: 'Johnny Bravo', icon: '💪' },
    'Shiba': { name: 'Shiba', icon: '🐕' },
};

const getPackConfig = (folderName) => {
    return (
        PACK_CONFIG[folderName] || {
            name: folderName.replace(/[0-9]/g, '').trim() || folderName,
            icon: '🎨',
        }
    );
};

const extractIndex = (filename) => {
    const match = filename.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

const getImageFiles = (dir) => {
    const files = fs.readdirSync(dir);
    return files
        .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
        .sort((a, b) => extractIndex(a) - extractIndex(b));
};

const generateStickerLoader = () => {
    const packs = [];
    const folders = fs.readdirSync(STICKERS_DIR, { withFileTypes: true });

    folders.forEach((folder) => {
        if (!folder.isDirectory()) return;

        const folderName = folder.name;
        const folderPath = path.join(STICKERS_DIR, folderName);
        const imageFiles = getImageFiles(folderPath);
        const config = getPackConfig(folderName);

        if (imageFiles.length === 0) return;

        const packId = folderName.toLowerCase().replace(/\s+/g, '-');
        const stickers = imageFiles.map((file, index) => {
            // Use alias @/ for consistency with other assets in the project
            // Folder names now use hyphens instead of spaces, so Metro should handle them correctly
            const filePath = `@/theme/assets/stickers/${folderName}/${file}`;
            const stickerId = `${packId}-${index}`;
            const stickerName = `${config.name} ${index + 1}`;

            return {
                id: stickerId,
                name: stickerName,
                requirePath: filePath,
            };
        });

        packs.push({
            id: packId,
            name: config.name,
            icon: config.icon,
            folderName,
            stickers,
        });
    });

    // Sort packs alphabetically
    packs.sort((a, b) => a.name.localeCompare(b.name));

    // Generate code
    let code = `/**
 * Sticker Loader Utility
 * AUTO-GENERATED FILE - Do not edit manually!
 * Run: node scripts/generateStickers.js to regenerate
 * 
 * This file automatically loads sticker assets from local filesystem.
 * To add new stickers, just add files to the folders and run the generate script.
 */

import type { ImageSourcePropType } from 'react-native';

type StickerAsset = {
    readonly id: string;
    readonly source: ImageSourcePropType;
    readonly name: string;
};

type StickerPackAssets = {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly stickers: readonly StickerAsset[];
};

// Helper function to create sticker asset
const createSticker = (
    packId: string,
    index: number,
    name: string,
    requireFn: () => ImageSourcePropType,
): StickerAsset => ({
    id: \`\${packId}-\${index}\`,
    source: requireFn(),
    name,
});

// Sticker Packs with local assets - AUTO-GENERATED
export const STICKER_PACKS: readonly StickerPackAssets[] = [
`;

    packs.forEach((pack) => {
        code += `    {\n`;
        code += `        id: '${pack.id}',\n`;
        code += `        name: '${pack.name}',\n`;
        code += `        icon: '${pack.icon}',\n`;
        code += `        stickers: [\n`;

        pack.stickers.forEach((sticker, index) => {
            code += `            createSticker('${pack.id}', ${index}, '${sticker.name}', () => require('${sticker.requirePath}')),\n`;
        });

        code += `        ],\n`;
        code += `    },\n`;
    });

    code += `];

// Convert to format expected by StickerPicker
export type Sticker = {
    readonly id: string;
    readonly uri: string | ImageSourcePropType;
    readonly name: string;
};

export type StickerPack = {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly stickers: readonly Sticker[];
};

// Convert sticker assets to sticker format
export const getStickerPacks = (): readonly StickerPack[] => {
    return STICKER_PACKS.map((pack) => ({
        id: pack.id,
        name: pack.name,
        icon: pack.icon,
        stickers: pack.stickers.map((sticker) => ({
            id: sticker.id,
            uri: sticker.source as string | ImageSourcePropType,
            name: sticker.name,
        })),
    }));
};
`;

    fs.writeFileSync(OUTPUT_FILE, code, 'utf8');
    console.log(`✅ Generated ${OUTPUT_FILE}`);
    console.log(`📦 Found ${packs.length} sticker packs with ${packs.reduce((sum, p) => sum + p.stickers.length, 0)} total stickers`);
};

try {
    generateStickerLoader();
} catch (error) {
    console.error('❌ Error generating sticker loader:', error);
    process.exit(1);
}
