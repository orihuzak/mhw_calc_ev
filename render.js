////////////////////////////// 出力・描画 ///////////////////////////////

/**
 * Objectのvalからul要素をつくる関数
 * @param {*} props 
 */
function UlFromObjVals(props){  // 最初の文字は大文字じゃないとダメ
    const obj = props.obj
    // objectのitemを１つずつli化して、liのリストをつくる
    const listItems = Object.entries(obj).map((item) =>
        <li key={item[0].toString()}>{item[1]}</li>
    )
    return (
        <ul>{listItems}</ul>
    )
}

/** 
 * 期待値計算機
*/
class EvCalculator extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            attack: 0,
            affinity: 0,
            // スキル
            atkBoost: SKILLS.atkBoost[0],
            agitator: SKILLS.agitator[0], 
            latentPower: 0,
            criticalBoost: SKILLS.criticalBoost[0],
            maximumMight: 0,
            weaknessExploit: 0,
            criticalEye: 0, 
            resentment: 0,
            peakPerformance: 0,
            fortify: 1,
            heroics: 1,
            nonElementalBoost: 1
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(event) {
        const target = event.target
        // 複数の入力をとるときは以下のようにname属性を使って変数化する
        const name = target.name
        
        // 武器データの場合
        if(["attack", "affinity"].indexOf(name) >= 0){
            this.setState({[name]: target.value})
        // スキルの場合 スキル名とレベルからスキル効果を取得してstateに格納
        }else{
            this.setState({[name]: SKILLS[name][target.value]})
        }
    }

    /**
     * inputがクリックされたらvalueを選択状態にする
     * @param {*} event 
     */
    handleClick(event){
        event.target.select()
    }

    /**
     * 全inputとselectを初期値に再設定
     * @param {*} event 
     */
    handleReset(event){
        this.setState({
            attack: 0,
            affinity: 0,
            // スキル
            atkBoost: SKILLS.atkBoost[0],
            agitator: SKILLS.agitator[0], 
            latentPower: 0,
            criticalBoost: SKILLS.criticalBoost[0],
            maximumMight: 0,
            weaknessExploit: 0,
            criticalEye: 0, 
            resentment: 0,
            peakPerformance: 0,
            fortify: 1,
            heroics: 1,
            nonElementalBoost: 1
        })
        event.preventDefault();
    }
    
    /**
     * 期待値計算関数
     * @return 計算結果を格納したobj attack, affinity, ev
     */
    _calcExpectedValue(){
        const state = this.state
        // attackに乗算スキルの効果を掛ける
        let attack = state.attack * state.nonElementalBoost * 
                     state.heroics * state.fortify
        // 加算スキルと攻撃力&会心スキルの攻撃力部分を加算
        attack += state.peakPerformance + state.resentment + 
                  state.atkBoost.atk + state.agitator.atk
        // 会心率と会心スキルを合計 (0を引いているのは文字列を数値にするため)
        let affinity = (state.affinity - 0) + state.criticalEye + 
                       state.weaknessExploit + state.maximumMight + 
                       state.latentPower + state.atkBoost.affi + state.agitator.affi
        
        // affinityが100を超えないように調整
        if(affinity > 100){ affinity = 100 }
        // affinityがマイナスなら会心倍率を1.25に固定
        const affiRatio = affinity < 0 ? 1.25 : state.criticalBoost

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

    render() {
        const state = this.state
        // 計算
        const result = this._calcExpectedValue()

        return (
            <form onSubmit={this.handleReset}>
                <table>
                    <thead>
                        <tr>
                            <th>基礎攻撃力</th>
                            <th>会心率(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input name="attack" type="number" value={state.attack} onChange={this.handleChange} onClick={this.handleClick} />
                            </td>
                            <td>
                                <input name="affinity" type="number" value={state.affinity} onChange={this.handleChange} onClick={this.handleClick} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>無属性強化</th>
                            <th>火事場力</th>
                            <th>不屈</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name="nonElementalBoost" value={state.value} onChange={this.handleChange}>
                                    <option value="0">OFF</option>
                                    <option value="1">ON</option>
                                </select>
                            </td>
                            <td>
                                <select name="heroics" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select name="fortify" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th>攻撃</th>
                            <th>挑戦者</th>
                            <th>無傷</th>
                            <th>逆上</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name="atkBoost" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </td>
                            <td>
                                <select name="agitator" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select name="peakPerformance" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="resentment" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th>見切り</th>
                            <th>弱点特攻</th>
                            <th>渾身</th>
                            <th>力の解放</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name="criticalEye" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </td>
                            <td>
                                <select name="weaknessExploit" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="maximumMight" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="latentPower" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr>
                            <th>超会心</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name="criticalBoost" value={state.value} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>反映後攻撃力</th>
                            <th>合計会心率</th>
                            <th>期待値</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{result.attack}</td>
                            <td>{result.affinity}</td>
                            <td>{result.ev}</td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="リセット" />
            </form>
        )
    }
}

ReactDOM.render(
    <EvCalculator />,
    document.getElementById('calcEv')
)