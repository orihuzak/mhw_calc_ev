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


function plusFive(x){
    return (x - 0) + 5
}

/**
 * Calculatorのステータスを初期化する関数
 * 武器のステータスとスキルレベルを全て0で初期化します
 * @return {object} status calculatorが使用するステータスobjectです
 */
function initializeCalculatorStatus(){
    let status = {
        attack: 0,
        affinity: 0,
        physicalSharpness: "green",
        resultAttack: 0,
        resultAffinity: 0,
        resultEv: 0,
    }
    
    // スキル名とレベルを初期化
    for(let name of Object.keys(SKILLS)){
        status[name] = 0
    }

    return status
}

class EvCalculator extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.selectInput = this.selectInput.bind(this)
    }

    handleChange(event){
        // 親のonChangeを呼んで親のstateを変更
        const target = event.target
        this.props.onChange(target.id, target.name, target.value)
    }

    selectInput(event){
        event.target.select()
    }

    render() {
        const id = this.props.id
        const status = this.props.status

        return (
            <form>
                <table>
                    <thead>
                        <tr>
                            <th>基礎攻撃力</th>
                            <th>会心率(%)</th>
                            <th>斬れ味</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input 
                                    key={id}
                                    id={id}
                                    name="attack"
                                    type="number"
                                    value={status.attack}
                                    onChange={this.handleChange} onClick={this.selectInput} />
                            </td>
                            <td>
                                <input 
                                    key={id}
                                    id={id}
                                    name="affinity"
                                    type="number"
                                    value={status.affinity} 
                                    onChange={this.handleChange} onClick={this.selectInput} />
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="physicalSharpness"
                                    value={status.physicalSharpness}
                                    onChange={this.handleChange}>
                                    <option value="red">赤</option>
                                    <option value="orange">橙</option>
                                    <option value="yellow">黄</option>
                                    <option value="green">緑</option>
                                    <option value="blue">青</option>
                                    <option value="white">白</option>
                                </select>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="nonElementalBoost"
                                    value={status.nonElementalBoost} onChange={this.handleChange}>
                                    <option value="0">OFF</option>
                                    <option value="1">ON</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="heroics"
                                    value={status.heroics}
                                    onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="fortify"
                                    value={status.fortify}
                                    onChange={this.handleChange}>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="atkBoost"
                                    value={status.atkBoost}
                                    onChange={this.handleChange}>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="agitator"
                                    value={status.agitator}
                                    onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="peakPerformance"
                                    value={status.peakPerformance} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="resentment"
                                    value={status.resentment}
                                    onChange={this.handleChange}>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="criticalEye"
                                    value={status.criticalEye}
                                    onChange={this.handleChange}>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="weaknessExploit"
                                    value={status.weaknessExploit} onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="maximumMight"
                                    value={status.maximumMight}
                                    onChange={this.handleChange}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </td>
                            <td>
                                <select 
                                    key={id}
                                    id={id}
                                    name="latentPower"
                                    value={status.latentPower}
                                    onChange={this.handleChange}>
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
                                <select 
                                    key={id}
                                    id={id}
                                    name="criticalBoost"
                                    value={status.criticalBoost}
                                    onChange={this.handleChange}>
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
                            <th>攻撃力（計算後）</th>
                            <th>合計会心率</th>
                            <th>期待値</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{status.resultAttack}</td>
                            <td>{status.resultAffinity}</td>
                            <td>{status.resultEv}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        )
    }
}

class CalculatorManager extends React.Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.addCalculator = this.addCalculator.bind(this)
        this.removeCalculator = this.removeCalculator.bind(this)
        this.resetCalculator = this.resetCalculator.bind(this)
        this.state = {
            calculators:{
                [uuid4()]: initializeCalculatorStatus(),
            }
        }
    }

    handleChange(key, statusName, statusValue){
        let calculators = {...this.state.calculators}
        let calculator = {...calculators[key]}
        calculator[statusName] = statusValue
        // 計算して計算結果を反映
        const result = calcExpectedValue(calculator)
        calculator.resultAttack = result.attack
        calculator.resultAffinity = result.affinity
        calculator.resultEv = result.ev
        calculators[key] = calculator
        this.setState({ calculators })
    }

    addCalculator(event){
        const copiedStatus = this.state.calculators[event.target.id]
        const newId = uuid4()
        const calculators = {...this.state.calculators}
        calculators[newId] = copiedStatus
        this.setState({ calculators })
    }

    removeCalculator(event){
        // 現在のcalculatorの数が1なら削除しない
        if(Object.keys(this.state.calculators).length == 1){
            alert("残り１コなんで削除できません。")
            return
        }
        const calculators = {...this.state.calculators}
        delete calculators[event.target.id]
        this.setState({ calculators })
    }

    resetCalculator(event){
        const id = event.target.id
        const calculators = {...this.state.calculators}
        // リセット関数とかを設置する
        calculators[id] = initializeCalculatorStatus()
        this.setState({ calculators })
    }

    render(){
        // stateの情報をもとにliを作成
        const apps = []
        const calculators = this.state.calculators
        for(const [key, status] of Object.entries(calculators)){
            apps.push(
                <li key={key}>
                    <div className="app-header">
                        <button
                            id={key}
                            className="reset"
                            onClick={this.resetCalculator}>
                            &#x21BB;
                        </button>
                        <button
                            id={key}
                            className="new"
                            onClick={this.addCalculator}>
                            ＋
                        </button>
                        <button 
                            id={key}
                            className="close"
                            onClick={this.removeCalculator}>
                            ×
                        </button>
                    </div>
                    <EvCalculator
                        key={key}
                        id={key}
                        status={status}
                        onChange={this.handleChange} />
                </li>
            )
        }
        return (<ul>{apps}</ul>)
    }
}


ReactDOM.render(
    <CalculatorManager />,
    document.getElementById("container")
)



