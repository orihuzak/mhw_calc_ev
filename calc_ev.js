/////////////////////////////// Skills /////////////////////////////////

////////////////////// 攻撃UPスキル ////////////////////////
////////////// 乗算スキル ////////////////

/** 無属性強化 */
const NON_ELEMENTAL_BOOST = {
    0: 1,
    1: 1.1
}

/** 火事場スキル */
const HEROICS = {
    0: 1,
    1: 1.05,
    2: 1.1, 
    3: 1.15,
    4: 1.2,
    5: 1.3
}

/** 不屈 */
const FORTIFY = {
    0: 1,
    1: 1.1,
    2: 1.2,
}

////////////// 加算スキル ////////////////

/** 無傷 */
const PEAK_PERFORMANCE = {
    0: 0,
    1: 5,
    2: 10,
    3: 20
}

/** 逆上 */
const RESENTMENT = {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25
}

////////////////////// 会心UPスキル ////////////////////////
/** 見切り */
const CRITICAL_EYE = {
    0: 0,
    1: 3,
    2: 6,
    3: 10,
    4: 15,
    5: 20,
    6: 25,
    7: 30
}

/** 弱点特攻 */
const WEAKNESS_EXPLOIT = {
    0: 0,
    1: 15,
    2: 30,
    3: 50
}

/** 渾身 */
const MAXIMUM_MIGHT = {
    0: 0,
    1: 10,
    2: 20,
    3: 30
}

/** 超会心 */
const CRITICAL_BOOST = {
    0: 1.25,
    1: 1.3,
    2: 1.35,
    3: 1.4
}

/** 力の解放 */
const LATENT_POWER = {
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50
}

//////////////////// 攻撃&会心スキル /////////////////////

/** 攻撃力UP */
const ATK_BOOST = {
    0: {atk: 0, affi: 0},
    1: {atk: 3, affi: 0},
    2: {atk: 6, affi: 0},
    3: {atk: 9, affi: 0},
    4: {atk: 12, affi: 5},
    5: {atk: 15, affi: 5},
    6: {atk: 18, affi: 5},
    7: {atk: 21, affi: 5}
}

/** 挑戦者 */
const AGITATOR = {
    0: {atk: 0, affi: 0},
    1: {atk: 4, affi: 3},
    2: {atk: 8, affi: 6},
    3: {atk: 12, affi: 9},
    4: {atk: 16, affi: 12},
    5: {atk: 20, affi: 15},
}

/**
 * 会心期待値を計算する関数
 * @param affi_pct 会心率(%)
 * @param affi_ratio 会心倍率
 */
function calc_affi_ev(affi_pct, affi_ratio){
    return 1 + (affi_ratio - 1) * affi_pct / 100
}

/** 期待値を計算して返す
 * @param atk スキル反映後の基礎攻撃力
 * @param affi_pct 会心率
 * @param affi_ratio 会心倍率
 * @return 期待値
 */
function calc_ev(atk, affi_pct, affi_ratio=1.25){
   return atk * calc_affi_ev(affi_pct, affi_ratio)
}

let atk = 210
let affi_pct = 80
let affi_ratio = 1.25

console.log(`基礎攻撃力:    ${atk}`)
console.log(`会心率:    ${affi_pct}`)
console.log(`会心倍率:  ${affi_ratio}`)
console.log(`期待値:    ${calc_ev(atk, affi_pct, affi_ratio)}`)
console.log(`期待値上昇率:  ${calc_ev(atk, affi_pct, affi_ratio) / calc_ev(atk, 0)}`)
