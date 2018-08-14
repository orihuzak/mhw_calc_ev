//////////////////////////////// Math //////////////////////////////////
/**
 * 第一引数を第二引数で指定した少数部の桁数までに切り捨てて返す
 * @param (Number)x 切り捨てしたい数
 * @param (Number)y 少数部の切り捨てたい桁数
 * @return 指定した桁数で少数部を切り捨てたx
 * yを指定しない場合は0で少数部を丸ごと切り捨てて整数部を返す
 */
function truncDecimalPlace(x, y=0){ 
    return Math.trunc(x * (10 ** y)) / (10 ** y)
}


/////////////////////////////// Skills /////////////////////////////////
const SKILL_NAME_LIST = ["atk_boost", "agitator", "latent_power","critical_boost", "maximum_might", "weakness_exploit", "critical_eye", "resentment", "peak_performance", "fortify", "heroics", "non_elemental_boost"]

/**
 * スキル効果をまとめたobj
 * SKLLS[skillName][skillLevel]
 * という感じで呼び出す
 */
const SKILLS = {
    //////////////////// 攻撃&会心スキル /////////////////////
    atkBoost: {
        0: {atk: 0, affi: 0},
        1: {atk: 3, affi: 0},
        2: {atk: 6, affi: 0},
        3: {atk: 9, affi: 0},
        4: {atk: 12, affi: 5},
        5: {atk: 15, affi: 5},
        6: {atk: 18, affi: 5},
        7: {atk: 21, affi: 5}
    },
    agitator: {
        0: {atk: 0, affi: 0},
        1: {atk: 4, affi: 3},
        2: {atk: 8, affi: 6},
        3: {atk: 12, affi: 9},
        4: {atk: 16, affi: 12},
        5: {atk: 20, affi: 15},
    },
    ////////////// 乗算スキル ////////////////
    /** 無属性強化 */
    nonElementalBoost: {
        0: 1,
        1: 1.1
    },
    /** 火事場スキル */
    heroics: {
        0: 1,
        1: 1.05,
        2: 1.1, 
        3: 1.15,
        4: 1.2,
        5: 1.3
    },
    /** 不屈 */
    fortify: {
        0: 1,
        1: 1.1,
        2: 1.2,
    },
    ////////////// 加算スキル ////////////////
    /** 無傷 */
    peakPerformance: {
        0: 0,
        1: 5,
        2: 10,
        3: 20
    },
    /** 逆上 */
    resentment: {
        0: 0,
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 25
    },
    ////////////////////// 会心スキル ////////////////////////
    /** 見切り */
    criticalEye: {
        0: 0,
        1: 3,
        2: 6,
        3: 10,
        4: 15,
        5: 20,
        6: 25,
        7: 30
    },
    /** 弱点特攻 */
    weaknessExploit: {
        0: 0,
        1: 15,
        2: 30,
        3: 50
    },
    /** 渾身 */
    maximumMight: {
        0: 0,
        1: 10,
        2: 20,
        3: 30
    },
    /** 力の解放 */
    latentPower: {
        0: 0,
        1: 10,
        2: 20,
        3: 30,
        4: 40,
        5: 50
    },
    //////////////////// 会心倍率スキル //////////////////////
    /** 超会心 */
    criticalBoost: {
        0: 1.25,
        1: 1.3,
        2: 1.35,
        3: 1.4
    }
}

/**
 * 会心期待値を計算する関数
 * @param affiPct 会心率(%)
 * @param affiRatio 会心倍率
 */
function calcAffiEv(affiPct, affiRatio=1.25){
    return 1 + (affiRatio - 1) * affiPct / 100
}

/** 武器とスキルを考慮した期待値を計算して返す
 * @param atk スキル反映後の基礎攻撃力
 * @param affiPct 会心率
 * @param affiRatio 会心倍率
 * @return 期待値
 */
function calcEv(atk, affiPct, affiRatio=1.25){
   return atk * calcAffiEv(affiPct, affiRatio)
}

/*
console.log(`基礎攻撃力:    ${EvObj.attack}`)
console.log(`会心率:    ${EvObj.affi_pct}`)
console.log(`会心倍率:  ${EvObj.affi_ratio}`)
console.log(`期待値:    ${calc_ev(EvObj.attack, EvObj.affi_pct, 
                                 EvObj.affi_ratio)}`)
console.log(`期待値上昇率:  ${calc_ev(EvObj.attack, EvObj.affi_pct, 
                                    EvObj.affi_ratio)
                            / calc_ev(EvObj.attack, 0)}`)*/
