/**
 * 常にある値を持つラジオボタン。あるボタンが押された時は、そのボタンの値を持つ。
 * どのボタンも押されてない場合はユーザーが設定したdefault値を持つラジオボタン
 * @param {string} id 必須 個々のボタンを識別する文字列。必ずユニークなものが必要
 * @param {string} label ボタンの上に表示される外見上の名前
 * @param {string} value 必須 ボタンが持つ値
 * @param {stinrg} groupName ボタンのグループ名。managerがもつボタンが共通して持つ
 * @param {string} defaultValue どのボタンも押されていないときに持つ値
 */
class NonZeroRadioButtonManager extends React.Component{
    constructor(props){
        super(props)

        let buttonFlags = {}
        for(const material of this.props.materials){
            buttonFlags[material.id] = false
        }
        
        this.defaultValue = this.props.defaultValue
        this.value = this.defaultValue
        this.state = {
            buttonFlags: buttonFlags
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event){
        this._updateState(event)
        this.props.onClick(event, this.value)
    }

    _updateState(event){
        const target = event.target
        const newFlag = !this.state.buttonFlags[target.id]
        
        const newButtonFlags = {...this.state.buttonFlags}
        if(newFlag === true){
            for(const id in Object.keys(this.state.buttonFlags)){
                if(!(target.id === id)) {newButtonFlags[id] = false}
            }
        }
        newButtonFlags[target.id] = newFlag
        this.value = newFlag ? event.target.value 
                                 : this.defaultValue
        this.setState({ buttonFlags: newButtonFlags })
    }

    render(){
        const radioButtons = this.props.materials.map( material => {
            return <NonZeroRadioButton
                        key={material.id}
                        id={material.id}
                        groupName={material.groupName}
                        label={material.label}
                        value={material.value}
                        selectedClassName=
                            {this.props.classNames.selected}
                        normalClassName={this.props.classNames.normal}
                        isSelected={this.state.buttonFlags[material.id]}
                        onClick={this.handleClick}
                    />
        })
        return (
            <div>
                {radioButtons}
            </div>
        )
    }
}

class NonZeroRadioButton extends React.Component {
    constructor(props){
        super(props)
        this.buttonClick = this.buttonClick.bind(this)
    }

    buttonClick(event){
        this.props.onClick(event)
    }

    render(){
        return (
            <button
                type="button"
                id={this.props.id}
                className={this.props.isSelected ?
                    this.props.selectedClassName : this.props.normalClassName}
                name={this.props.groupName}
                value={this.props.value}
                onClick={this.buttonClick} >
                {this.props.label}
            </button>
        )
    }
}

class TestApps extends React.Component{

    render(){
        const materialsForButtons = []
        for(let i = 1; i <= 5; i++){
            materialsForButtons.push(
                {
                    groupName: "group",
                    id: i.toString(),
                    label: i.toString(),
                    value: i.toString()
                }
            )
        }

        return (
            <NonZeroRadioButtonManager materials={materialsForButtons} />
        )   
    }
}
  
ReactDOM.render(<TestApps />, document.getElementById("container"));