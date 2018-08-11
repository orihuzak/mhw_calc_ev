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
 * 入力フォームと入力値を受け取って保持するクラス
 * 入力値を渡す機能をもつ
*/
class EvForm extends React.Component {
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
            nonElementalBoost: 1,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleCalc = this.handleCalc.bind(this)
    }

    handleChange(event) {
        const target = event.target
        // 複数の入力をとるときは以下のようにname属性を使って変数化する
        const name = target.name

        // 武器データの場合
        if(["attack", "affinity"].indexOf(name) >= 0){
            this.setState({
                [name]: target.value
            })
        // スキルの場合
        }else{
            this.setState({
                [name]: SKILLS[name][target.value]
            })
        } 
    }
    
    handleCalc(event) {
        let state = this.state
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
        // 期待値を計算
        let result = calcEv(attack, affinity, state.criticalBoost)

        // 端数どしよ
        console.log(this.state)
        console.log(attack, affinity, result)
        // 出力！

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleCalc}>
                <label>
                    基礎攻撃力：
                    <input name="attack" type="number" value={this.state.attack} onChange={this.handleChange} />
                </label>
                <label>
                    会心率(%)：
                    <input name="affinity" type="number" value={this.state.affinity} onChange={this.handleChange} />
                </label>
                <label>
                    攻撃：
                    <select name="atkBoost" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </label>
                <label>
                    挑戦者：
                    <select name="agitator" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <label>
                    無属性強化：
                    <select name="nonElementalBoost" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">OFF</option>
                        <option value="1">ON</option>
                    </select>
                </label>
                <label>
                    火事場：
                    <select name="heroics" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <label>
                    不屈：
                    <select name="fortify" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <label>
                    無傷：
                    <select name="peakPerformance" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>
                <label>
                    逆上：
                    <select name="resentment" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <label>
                    見切り：
                    <select name="criticalEye" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </label>
                <label>
                    弱点特攻：
                    <select name="weaknessExploit" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>
                <label>
                    渾身：
                    <select name="maximumMight" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>
                <label>
                    超会心：
                    <select name="criticalBoost" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </label>
                <label>
                    力の解放：
                    <select name="latentPower" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <input name="calc" type="submit" value="計算" />
            </form>
        )
    }
}

ReactDOM.render(
    // 入力フォーム
    <EvForm />  // 使い方
    ,document.getElementById('input')
)

/* ulを出力する。あとで出力に使おう
ReactDOM.render(
    <UlFromObjVals obj={EvObj} />
    ,document.getElementById('output')
)*/