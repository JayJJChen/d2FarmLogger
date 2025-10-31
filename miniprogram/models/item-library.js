"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILT_IN_ITEMS = exports.ITEM_CATEGORIES = void 0;
// 物品分类
exports.ITEM_CATEGORIES = [
    { key: 'unique', name: '暗金', color: '#d4af37' },
    { key: 'set', name: '套装', color: '#4CAF50' },
    { key: 'rare', name: '稀有', color: '#FFD700' },
    { key: 'magic', name: '魔法', color: '#2196F3' },
    { key: 'rune', name: '符文', color: '#e74c3c' },
    { key: 'base', name: '底材', color: '#95a5a6' },
    { key: 'key', name: '钥匙', color: '#ff9800' },
    { key: 'essence', name: '精华', color: '#9C27B0' }
];
// 内置物品数据
exports.BUILT_IN_ITEMS = [
    // 符文 (33个)
    { id: 'rune_el_1', name: 'El(1)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_eld_2', name: 'Eld(2)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_tir_3', name: 'Tir(3)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_nef_4', name: 'Nef(4)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_eth_5', name: 'Eth(5)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ith_6', name: 'Ith(6)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_tal_7', name: 'Tal(7)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ral_8', name: 'Ral(8)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ort_9', name: 'Ort(9)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_thul_10', name: 'Thul(10)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_amn_11', name: 'Amn(11)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_sol_12', name: 'Sol(12)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_shael_13', name: 'Shael(13)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_dol_14', name: 'Dol(14)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_hel_15', name: 'Hel(15)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_io_16', name: 'Io(16)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_lum_17', name: 'Lum(17)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ko_18', name: 'Ko(18)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_fal_19', name: 'Fal(19)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_lem_20', name: 'Lem(20)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_pul_21', name: 'Pul(21)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_um_22', name: 'Um(22)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_mal_23', name: 'Mal(23)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ist_24', name: 'Ist(24)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_gul_25', name: 'Gul(25)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_vex_26', name: 'Vex(26)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ohm_27', name: 'Ohm(27)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_lo_28', name: 'Lo(28)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_sur_29', name: 'Sur(29)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_ber_30', name: 'Ber(30)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_jah_31', name: 'Jah(31)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_cham_32', name: 'Cham(32)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'rune_zod_33', name: 'Zod(33)', category: exports.ITEM_CATEGORIES[4], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    // 钥匙 (3个)
    { id: 'key_terror_1', name: '恐惧之钥 (A1)', category: exports.ITEM_CATEGORIES[6], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'key_hate_2', name: '憎恨之钥 (A2)', category: exports.ITEM_CATEGORIES[6], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'key_destruction_5', name: '毁灭之钥 (A5)', category: exports.ITEM_CATEGORIES[6], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    // 精华 (4个)
    { id: 'essence_pain_1', name: '扭曲的苦痛精华 (A1/A2)', category: exports.ITEM_CATEGORIES[7], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'essence_hatred_3', name: '充盈的憎恨精华 (A3)', category: exports.ITEM_CATEGORIES[7], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'essence_fear_4', name: '燃烧的恐惧精华 (A4)', category: exports.ITEM_CATEGORIES[7], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() },
    { id: 'essence_decay_5', name: '溃烂的毁灭精华 (A5)', category: exports.ITEM_CATEGORIES[7], isBuiltIn: true, usageCount: 0, createTime: Date.now(), updateTime: Date.now() }
];
