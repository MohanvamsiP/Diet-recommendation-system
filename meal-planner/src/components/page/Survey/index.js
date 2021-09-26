import React, { Component } from 'react';
import { Redirect } from 'react-router'

import Select from '../../shared/Form/Select';
import { CheckboxGroup } from '../../shared/Form/Checkbox';
import RadioGroup, { Radio } from '../../shared/Form/Radio';
import Button from '../../shared/Button';
import Tabs, { Tab } from '../../shared/Tabs';
import Nav from '../../shared/Nav';
//api related
import getPlan from '../../../utils/mealPlan';
import { getSurveyData } from '../../../utils/data';

import './Survey.css';

export default class Survey extends Component{

  componentWillMount(){
    this.data = getSurveyData();
    const count = this.data.selectOpt.mealCount[0].val;
    const plan =  this.data.selectOpt.planType[0].val;
    const defaultDiet = {
      activeIndex : 0,
      name : this.data.dietSpec[0].name,
    };
    const person = {
      height: 180,
      weight: 70,
      age: 20,
      gender: "M"
    };
    const calories = {
      activeIndex : 0,
      selected : 'rec',
      min : this.data.calories.min,
      max : this.data.calories.max,
    }
    
    let isLoss = false
    let isGain = false
    let lossVal = 0
    let gainVal = 0
    let lossGoal = 0
    let gainGoal = 0

    this.setState({
      mealCount: count,
      planType: plan,
      healthPreferences: {},
      calories: calories,
      diet: defaultDiet,
      loading: false,
      redirect: false,
      person: person
    });
  }

  handleHealth = (name) => {
    this.setState ((prevState) => {
      let value = prevState.healthPreferences[name] ? !prevState.healthPreferences[name] : true;
      return {healthPreferences : {...prevState.healthPreferences,[name]:value}}
    });
  }

  handleSelect = (e) => {
    const target = e.target;
    this.setState({[target.name]: parseInt(target.value,10)});
  }

  handleCalories = (index) => {
    let selected = (parseInt(index,10) === 1) ? 'custom' : 'rec';
    this.setState({
      calories: {...this.state.calories, activeIndex: index, selected: selected }
    });
  }

  setCalories = (e) => {
    const target = e.target;
    if(target.value) {
      let value = parseInt(target.value,10);
      if(isNaN(value)){
        value = 0;
      }
      this.setState({calories: {...this.state.calories,[target.name]: value }});
    }
  }

  calcCalories = () =>{
    let bmr=0;
    if(this.state.person.gender === "M")
        bmr = 88.362 + (13.397 * this.state.person.weight) + (4.799 * this.state.person.height) - (5.677 * this.state.person.age);
    else if(this.state.person.gender === "F")
        bmr = 447.593 + (9.247 * this.state.person.weight) + (3.098 * this.state.person.height) - (4.330 * this.state.person.age);
    this.setState({
      calories: {...this.state.calories, min: bmr-100}
    });
    this.setState({
      calories: {...this.state.calories, max: bmr+600}
    });
    console.log(this.state.calories.min);
    console.log(this.state.calories.max);
  };

  setPerson = (e) => {
    const target = e.target;
    if(target.value) {
      let value = parseFloat(target.value);
      if(isNaN(value)){
        value = 0;
      }
      this.setState({person: {...this.state.person,[target.name]: value }});
    }
    this.calcCalories();
  }

  setGender = (e) =>{
    const target = e.target;
    let value = target.value;
    console.log(value);
    this.setState({person: {...this.state.person,[target.name]: value}});
    this.calcCalories();
  }

  handleDiet = (index) => {
    const name = this.data.dietSpec[index].name;
    if(name=="weight-loss"){
      console.log("loss")
      this.setState({isLoss:true})
      this.setState({isGain:false})
      this.setState({
        diet: { activeIndex:index, name:name }
      });
      // const drop =  parseInt(((((parseInt(this.state.lossGoal)/0.226796)*3500)/2)/7))
      // this.setState({lossVal:drop})
      // this.setState({gainVal:0})
      // const { mealCount, planType, healthPreferences, calories} = this.state;
      // const newMin = parseInt(calories.min) - parseInt(this.state.lossVal)

      // console.log("newMin",newMin)
      // this.setState({
      //   calories: {...this.state.calories, min: newMin}
      // });

      // const newMax = parseInt(calories.max) - parseInt(this.state.lossVal)
      // console.log("newMax",newMax)
      // this.setState({
      //   calories: {...this.state.calories, max: newMax}
      // });
      // 
    }else if (name=="weight-gain"){
      console.log("gain")
      this.setState({isGain:true})
      this.setState({isLoss:false})
      this.setState({
        diet: { activeIndex:index, name:name }
      });
      // const { mealCount, planType, healthPreferences, calories} = this.state;
      // const gain =  parseInt(((((parseInt(this.state.gainGoal)/0.226796)*3500)/2)/7))
      // this.setState({gainVal:gain})
      // this.setState({lossVal:0})
      // const newMin =parseInt(calories.min) + parseInt(this.state.gainVal)
      // console.log("newMin",newMin)
      // this.setState({
      //   calories: {...this.state.calories, min: newMin}
      // });

      // // const newMax = parseInt(calories.max) + parseInt(this.state.gainVal)
      // // console.log("newMax",newMax)
      // // this.setState({
      // //   calories: {...this.state.calories, max: newMax}
      // // });
    }else{
      this.setState({gainVal:0})
      this.setState({lossVal:0})
      this.setState({isGain:false})
      this.setState({isLoss:false})
    this.setState({
      diet: { activeIndex:index, name:name }
    });
  }
  }

  goTo = (e) => {
    e.preventDefault();
    const Tabs = this.tabs;
    switch(e.target.name){
      case "next":
        Tabs.handleClick(Tabs.state.activeIndex+1);
        console.log(this.state.calories)
        break;
      case "back":
        Tabs.handleClick(Tabs.state.activeIndex-1);
        break;
      default:
      break;
    }
    // console.log(this.state.calories)
  }

  getMealPlan = (e) => {
    e.preventDefault();
    const { mealCount, planType, healthPreferences, calories, diet } = this.state;
    // const dietPreference = this.data.dietSpec[diet.activeIndex].name;
    const meals = this.data.mealTypes[mealCount];
    const res = {
      plan: planType,
      health: healthPreferences,
      calories: {min:calories.min,max:calories.max},
      diet: diet.name,
      meals: meals,
    }
    this.setState({loading:true},() => {
      getPlan(res).then(
        (data) => {
          let par = {num:this.state.planType,data: data}
          //stop loading and redirect to meal page
          this.setState({loading:false, redirect: true, data: par});
        }
     );
    });
  }

  render(){
    const { selectOpt, dietSpec, healthSpec } = this.data;
    return(
      <div className="Survey">
        <Nav />
        {
          this.state.loading ?
          <div className="Survey__loading">
            <h1 className="Survey__loading__heading">Chopping those onions</h1>
            <i className="fa fa-spinner Survey__loading__icon" aria-hidden="true"></i>
          </div>
          :
          <div className="Survey__content">
            <div className="Survey__heading"><h1>Some quick questions to generate that awesome meal plan ..</h1></div>
            <form>
              <Tabs defaultIndex={0} ref = {component => {this.tabs = component}} className="Survey__tabs">
                <Tab heading="1">
                  <h2>How many meals do you ( or want to have ) in a day?</h2>
                  <Select name="mealCount" value={this.state.mealCount} handler={this.handleSelect} options={selectOpt.mealCount} />
                  <div className="Survey__goto">
                    <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                  </div>
                </Tab>

                <Tab heading="2">
                  <h2>Choose a plan type</h2>
                  <Select name="planType" value={this.state.planType} handler={this.handleSelect} options={selectOpt.planType} />
                  <div className="Survey__goto">
                    <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                    <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                  </div>
                </Tab>

                <Tab heading="3">
                  <h2>Any dietary preferences?</h2>
                  <RadioGroup handleChange={this.handleDiet} activeIndex={this.state.diet.activeIndex}>
                  {
                    dietSpec.map(
                      (diet)=> <Radio key={diet.name}>{diet.text}</Radio>
                    )
                   
                  }
                  </RadioGroup>
                  <div>
                  {this.state.isLoss && <input type="number" value={this.state.lossGoal} placeholder={"How many Kg(s) do you wish to loose per week?"} onChange={(e)=>{e.preventDefault();this.setState({lossGoal:e.target.value})}}></input>}
                  {this.state.isGain && <input type="number" value={this.state.gainGoal} placeholder={"How many Kg(s) do you wish to gain per week?"} onChange={(e)=>{e.preventDefault();this.setState({gainGoal:e.target.value})}}></input>}

                  </div>
                  <div className="Survey__goto">
                    <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                    <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                  </div>
                </Tab>

                <Tab heading="4" >
                  <h2>Any health preferences?</h2>
                  <CheckboxGroup data={healthSpec} toggleHandler={this.handleHealth} isCheckedState={this.state.healthPreferences} ></CheckboxGroup>
                  <div className="Survey__goto">
                    <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                    <Button name="next" onClick={this.goTo} className="Survey__goto__button--next">Next</Button>
                  </div>
                </Tab>

                <Tab heading="5">
                  <h2>Calorie intake</h2>
                  <RadioGroup handleChange={this.handleCalories} activeIndex={this.state.calories.activeIndex}>
                    <Radio>Go with recommended</Radio>
                    <Radio>Choose custom values</Radio>
                  </RadioGroup>
                  {
                    this.state.calories.selected === "custom" ?
                      ( <div className="Survey__input--custom">
                          {/* <input placeholder="min" type="number" name="min" onChange={this.setCalories} value={this.state.calories.min} />
                          <input placeholder="max" type="number" name="max" onChange={this.setCalories} value={this.state.calories.max}/> */}
                          <table>
                            <tr>
                              <td><label htmlFor="height">Height</label></td>
                              <td><input placeholder="height" type="number" name="height" onChange={this.setPerson} value={this.state.person.height} id="height"/></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="weight">Weight</label></td>
                              <td><input placeholder="weight" type="number" name="weight" onChange={this.setPerson} value={this.state.person.weight} id="weight"/></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="age">Age</label></td>
                              <td><input placeholder="age" type="number" name="age" onChange={this.setPerson} value={this.state.person.age} id="age"/></td>
                            </tr>
                          </table>
                          Gender:
                          <input style={{margin:8}} type="radio" name="gender" onChange={this.setGender} value="M" id="male"/>
                          <label htmlFor="male">Male</label>
                          <input style={{margin:8}} type="radio" name="gender" onChange={this.setGender} value="F" id="female"/>
                          <label htmlFor="female">Female</label>
                        </div>
                      )
                      :null
                    }
                  <div className="Survey__goto">
                    <Button name="back" onClick={this.goTo} className="Survey__goto__button--back">Back</Button>
                    <Button onClick={this.getMealPlan} className="Survey__goto__button--next">Get Plan!</Button>
                  </div>
                </Tab>
              </Tabs>
            </form>
          </div>
        }
        {
          this.state.redirect ? <Redirect to={{pathname:"/meal-plan",state:{data:this.state.data}}}/> : null
        }
      </div>
    )
  }
}
