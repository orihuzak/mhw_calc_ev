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

/**
 * 期待値計算関数
 * この関数はclassの外に出す
 * @return 計算結果を格納したobj attack, affinity, ev
 */
function calcExpectedValue(status){
    // attackに乗算スキルの効果を掛ける
    let attack = status.attack
                * SKILLS.nonElementalBoost[status.nonElementalBoost] 
                * SKILLS.heroics[status.heroics]
                * SKILLS.fortify[status.fortify]
    // 加算スキルと攻撃力&会心スキルの攻撃力部分を加算
    attack += SKILLS.peakPerformance[status.peakPerformance]
                + SKILLS.resentment[status.resentment]
                + SKILLS.atkBoost[status.atkBoost].atk
                + SKILLS.agitator[status.agitator].atk
    // 会心率と会心スキルを合計 (0を引いているのは文字列を数値にするため)
    let affinity = (status.affinity - 0) 
                    + SKILLS.criticalEye[status.criticalEye]
                    + SKILLS.weaknessExploit[status.weaknessExploit]
                    + SKILLS.maximumMight[status.maximumMight]
                    + SKILLS.latentPower[status.latentPower]
                    + SKILLS.atkBoost[status.atkBoost].affi
                    + SKILLS.agitator[status.agitator].affi
    
    // affinityが100を超えないように調整
    if(affinity > 100){ affinity = 100 }
    // affinityがマイナスなら会心倍率を1.25に固定
    const affiRatio = (affinity < 0) 
                        ? 1.25 
                        : SKILLS.criticalBoost[status.criticalBoost]

    let ev = calcEv(attack, affinity, affiRatio)
    // 期待値を計算
    let result = {
        attack: truncDecimalPlace(attack, 3), // スキル反映後の攻撃力
        affinity: affinity, // スキル反映後の会心率
        // 期待値
        ev: truncDecimalPlace(ev, 3)
    }
    return result
}