/**
 * アプリを追加したり削除するクラス
*/
class AppControler extends　React.Component {
    constructor(props){
        super(props)
        this.state = {
            apps: [<EvCalculator 
                id={0}
                vars={this.state.vars[target.id]}
                onChange={this.handleChange} />],
            vars: [{
                // スキルレベルを持つobj
                attack: 0,
                affinity: 0,
            },]
        }
        // スキル名とレベルを初期化
        for(let name of Object.keys(SKILLS)){
            this.state.vars[0][name] = 0
        }

        this.handleAdd = this.handleAdd.bind(this)
    }

    handleChange(e, id){
        const target = e.target
        this.state.vars[id][target.name] = target.value
        setState(this.state)
    }

    handleAdd(e){
        const target = e.target
        this.state.apps.push(
            <EvCalculator 
                id={target.id}
                vars={this.state.vars[target.id]}
                onChange={this.handleChange} />)
        this.setState(this.state)
        console.log("追加できた？")
    }

    render(){
        return(
            <section>
                <ul>
                    {this.state.apps.map((app, i) => {
                        return (
                            <li key={i}>
                            {app}
                            <button id={i} onClick={this.handleAdd}>追加するボタン</button>
                            </li>
                        )
                    })}
                </ul>
                
            </section>
        )
    }
}

/** 
 * 期待値計算機
*/
class EvCalculator extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            // スキルレベルを持つobj
            attack: 0,
            affinity: 0,
        }
        // スキル名とレベルを初期化
        for(let name of Object.keys(SKILLS)){
            this.state[name] = 0
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(event) {
        const target = event.target
        // 複数の入力をとるときは以下のようにname属性を使って変数化する
        const name = target.name
        this.setState({[name]: target.value})
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
        // 全てのプロパティを0に再設定
        for(let name of Object.keys(this.state)){
            this.state[name] = 0
        }
        this.setState(this.state)   // 表示を更新
        event.preventDefault()
    }
    
    /**
     * 期待値計算関数
     * @return 計算結果を格納したobj attack, affinity, ev
     */
    _calcExpectedValue(){
        const state = this.state
        // attackに乗算スキルの効果を掛ける
        let attack = state.attack
                    * SKILLS.nonElementalBoost[state.nonElementalBoost] 
                    * SKILLS.heroics[state.heroics]
                    * SKILLS.fortify[state.fortify]
        // 加算スキルと攻撃力&会心スキルの攻撃力部分を加算
        attack += SKILLS.peakPerformance[state.peakPerformance]
                  + SKILLS.resentment[state.resentment]
                  + SKILLS.atkBoost[state.atkBoost].atk
                  + SKILLS.agitator[state.agitator].atk
        // 会心率と会心スキルを合計 (0を引いているのは文字列を数値にするため)
        let affinity = (state.affinity - 0) 
                        + SKILLS.criticalEye[state.criticalEye]
                        + SKILLS.weaknessExploit[state.weaknessExploit]
                        + SKILLS.maximumMight[state.maximumMight]
                        + SKILLS.latentPower[state.latentPower]
                        + SKILLS.atkBoost[state.atkBoost].affi
                        + SKILLS.agitator[state.agitator].affi
        
        // affinityが100を超えないように調整
        if(affinity > 100){ affinity = 100 }
        // affinityがマイナスなら会心倍率を1.25に固定
        const affiRatio = (affinity < 0) 
                          ? 1.25 
                          : SKILLS.criticalBoost[state.criticalBoost]

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
            <form>
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
                                <select name="nonElementalBoost" value={state.nonElementalBoost} onChange={this.handleChange}>
                                    <option value="0">OFF</option>
                                    <option value="1">ON</option>
                                </select>
                            </td>
                            <td>
                                <select name="heroics" value={state.heroics} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select name="fortify" value={state.fortify} onChange={this.handleChange}>
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
                                <select name="atkBoost" value={state.atkBoost} onChange={this.handleChange}>
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
                                <select name="agitator" value={state.agitator} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select name="peakPerformance" value={state.peakPerformance} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="resentment" value={state.resentment} onChange={this.handleChange}>
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
                                <select name="criticalEye" value={state.criticalEye} onChange={this.handleChange}>
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
                                <select name="weaknessExploit" value={state.weaknessExploit} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="maximumMight" value={state.maximumMight} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select name="latentPower" value={state.latentPower} onChange={this.handleChange}>
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
                                <select name="criticalBoost" value={state.criticalBoost} onChange={this.handleChange}>
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
                <button onClick={this.handleReset}>リセット</button>
            </form>
        )
    }
}