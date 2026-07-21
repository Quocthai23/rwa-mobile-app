/**
 * Script to rename sticker folders with spaces to use hyphens
 * This fixes Metro bundler issues with spaces in folder names
 * Run: node scripts/fixStickerFolders.js
 */

const fs = require('fs');
const path = require('path');

const STICKERS_DIR = path.join(__dirname, '../src/theme/assets/stickers');

const fixFolderNames = () => {
    const folders = fs.readdirSync(STICKERS_DIR, { withFileTypes: true });
    const renamed = [];

    folders.forEach((folder) => {
        if (!folder.isDirectory()) return;

        const oldName = folder.name;
        // Replace spaces with hyphens
        const newName = oldName.replace(/\s+/g, '-');

        if (oldName !== newName) {
            const oldPath = path.join(STICKERS_DIR, oldName);
            const newPath = path.join(STICKERS_DIR, newName);

            try {
                fs.renameSync(oldPath, newPath);
                renamed.push({ old: oldName, new: newName });
                console.log(`✅ Renamed: "${oldName}" → "${newName}"`);
            } catch (error) {
                console.error(`❌ Error renaming "${oldName}":`, error.message);
            }
        }
    });

    if (renamed.length > 0) {
        console.log(`\n📦 Renamed ${renamed.length} folder(s)`);
        console.log('\n⚠️  Please update PACK_CONFIG in scripts/generateStickers.js:');
        renamed.forEach(({ old, new: newName }) => {
            const configName = old.replace(/[0-9]/g, '').trim() || old;
            console.log(`   '${newName}': { name: '${configName}', icon: '🎨' },`);
        });
        console.log('\n💡 Then run: yarn generate:stickers');
    } else {
        console.log('✅ No folders need renaming');
    }
};

try {
    fixFolderNames();
} catch (error) {
    console.error('❌ Error fixing folder names:', error);
    process.exit(1);
}
