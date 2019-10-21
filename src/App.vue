<template>
  <v-app>
    <v-container fluid v-if="view === 'Login'">
      <v-row>
        <v-col cols=12>
          <h1>Leave Management System</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols=4> 
         <v-text-field solo type="text" name="username" v-model="input.username" label="Username"/>   
        </v-col>
      </v-row>
      <v-row>
        <v-col cols=3> 
          <p class="red--text" v-if="isError">{{ message }}</p>
        </v-col>
        <v-col cols=1>
         <v-btn color="teal" block type="button" @click="login">Login</v-btn> 
        </v-col>
      </v-row> 
    </v-container>
    <v-container fluid v-else-if="view === 'Leave'">
      <v-row>
        <v-col cols=10 class="blue--text">
          <h4>Welcome {{ input.username }} !!</h4>
        </v-col>
        <v-col cols=2 class="text-right">
          <v-btn text color="red" type="button" @click="logoff">Logoff</v-btn>
        </v-col>
      </v-row>
         
      <v-row>
        <v-col cols=10>
        <h3>Leave Statistics</h3>
        </v-col>
        <v-col cols=2 class="text-right">
          <h5 >{{timestamp}}</h5>
       </v-col>
      </v-row> 
      <v-row>
        <v-col cols=10>
          <v-simple-table dense dark> 
          <thead>
            <tr>
            
            <th>Leave Type </th>
            <th>Total Leaves</th>
            <th>Remaining Leaves</th>
            <th>Availed Leaves </th>
              
            </tr>
          </thead>
          <tbody>
            <tr>

            <td>Vacation</td> 
            <td>{{ user.holidays + vacationRecorded }}</td>
            <td>{{ user.holidays }}</td>
            <td>{{ vacationRecorded }}</td>
            
            </tr>
            <tr>

            <td>Sick</td> 
            <td>{{ user.sickdays + sickRecorded }}</td>
            <td>{{ user.sickdays }}</td>
            <td>{{sickRecorded}}</td>
            
            </tr>
          </tbody>
        </v-simple-table> 
       </v-col>
      </v-row>
      <v-row>
        <v-col cols=2>
         <v-btn color="teal" block  type="button" @click="setVacation">Availed Leaves</v-btn> 
        </v-col>
        <v-col cols=2>
         <v-btn color="teal" block  type="button" @click="setHoliday">Holidays List</v-btn> 
        </v-col>
        <v-col cols=2>
         <v-btn color="teal" block  type="button" @click="setLeave">Leave Details</v-btn> 
        </v-col>
        <v-col cols=2>
         <v-btn color="teal" block  type="button" @click="setApply">Apply Leaves</v-btn> 
        </v-col>
        <v-col cols=2>
         <v-btn color="teal" block  type="button" @click="setDelete">Delete Leaves</v-btn> 
        </v-col>
      </v-row>
      <v-row>
        <v-col cols=10>
           <div v-if="action === 'vacation'">
            <h3>Availed Leaves Details</h3>
            <v-simple-table>
            <thead>
              <tr>
              <th>Recorded Date </th>
              <th>Leave Type </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for ="leave in leaves">
              <td>{{ leave.date }}</td>
              <td>{{leave.type}}</td>
              </tr>
            </tbody>
            </v-simple-table>
           </div>
      
          <div v-if="action === 'holiday'">
            <h3>Public Holidays</h3>
            <v-simple-table>
            <thead>
              <tr>
              <th>Holiday Date </th>
              <th>Holiday Name </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for ="holiday in holidays">
              <td>{{ holiday.date }}</td>
              <td>{{holiday.name}}</td>
              </tr>
            </tbody>
            </v-simple-table>
          </div>

          <div v-if="action === 'leave'">
            <h3>Leave Details</h3>
            <v-simple-table>
            <thead>
              <tr>
              <th>Start Date </th>
              <th>End Date </th>
              <th>Leave Type </th>
              </tr>
            </thead>
            <tbody>
              <tr class="green">
              <td>{{stat.ssDate}}</td>
              <td>{{stat.esDate }}</td>
              <td>Sick</td>
              </tr>
              <tr class="teal">
              <td>{{stat.svDate}}</td>
              <td>{{stat.evDate}}</td>
              <td>Vacation</td>
              </tr>
            </tbody>
            </v-simple-table>
          </div>

         <div v-if="action === 'applyLeave'">
            <h3>Record New Leaves</h3>
            <v-simple-table>
            <tbody>
              <tr>
              <td>
              <v-text-field type="date" name="startDate" v-model="apply.AstartDate" label="Start Date"/>
              </td>
              <td>
              <v-text-field type="date" name="endDate" v-model="apply.AendDate" label="End Date"/>
              </td>
              <td>
              <v-select v-model="apply.Atype" label="Leave Type" :items="['vacation', 'sick']"> 
              </v-select>  
              </td> 
              <td>
              <span> Num of Days: {{apply.Adays}} </span>
              
              </td> 
              </tr> 
              <tr>
              <td> 
              <v-btn color="teal" type="button" @click="Validate">Submit</v-btn>
              </td> 
              </tr> 
              <tr></tr>
              <tr>
              <td> 
              <p class="red--text" v-if="apply.isDateError">{{ apply.Aerror }}</p>
              </td> 
              </tr> 
            </tbody>
            </v-simple-table>
          </div> 
          <div v-if="action === 'deleteLeave'">
            <h3>Delete Leaves</h3>
            <v-simple-table>
            <tbody>
              <tr>
              <td>
              <v-text-field type="date" name="stDate" v-model="del.stDate" label="Start Date"/>
              </td>
              <td>
              <v-text-field type="date" name="enDate" v-model="del.enDate" label="End Date"/>
              </td>
              </tr> 
              <tr>
              <td> 
              <v-btn color="teal" type="button" @click="validateDelete">Submit</v-btn>
              </td> 
              </tr> 
              <tr></tr>
              <tr>
              <td> 
              <p class="red--text" v-if="del.isDelMsg">{{ del.msg }}</p>
              </td> 
              </tr> 
            </tbody>
            </v-simple-table>
          </div>   
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>




<script>
import  { 
  getUser,getLeaves,getPublicHolidays,removeLeaves,recordLeaves
} from "./api.js"
import moment from 'moment'

export default {
  name: "App",
  data() {
    return {
      isError: false,
      view: "Login",
      action:"vacation",
      message: "",
      timestamp:"",
      user:null,
      rows: {
        id:"",
        name:"",
        holidays:"",
        sickdays:""
      },
      date:"",
      dates:[],
      leaves:[],
      holidays:[],
      allLeaves:[],
      currentDate:"" ,
      leave: {
        id:"",
        date:"",
        userid:"",
        type:""
       
      },
      holiday: {
        id:"",
        date:"",
        name:""
      },
     status:"",
     sickRecorded:0,
     vacationRecorded:0,
      
      input: {
        username: ""
      },
      apply: {
        AstartDate: "",
        AendDate: "",
        Atype:"",
        Adays:"" ,
        Aerror:"",
        isDateError:false ,
        present:false
      },
      del: {
        stDate: "",
        enDate: "",
        msg:"",
        isDelMsg:false,
        Ddays:"" 
      },
      stat: {
        ssDate: "",
        esDate: "",
        svDate: "",
        evDate: "",
        sickHol:[],
        vacHol:[],
	      allSick:[],
	      allVacation:[]
      },
      start:""
    };
  },

created() {
            setInterval(this.getNow, 1000);
            },
 
  
methods: {  
  async  login() {
      this.message = "";;
      this.view = "Login";
      
      if (this.input.username !== "") {
      this.user = await getUser(this.input.username);
        if (this.user){
          this.currentDate = moment().format("YYYY-MM-DD");
          this.view = "Leave";
          this.leaves= await getLeaves(this.user.id);
          this.holidays=await getPublicHolidays();
          this.holidays.sort((a,b) => (a.date > b.date) ? 1 : -1);
          
          for(const leave of this.leaves){
           if (leave.type==='sick'){
              this.sickRecorded=this.sickRecorded+1;
            } else {
              this.vacationRecorded=this.vacationRecorded+1;
            } 
          }
          
        } else {
          this.isError = true;
          this.message = "Username is incorrect";
        }
      } else {
        this.isError = true;
        this.message = "Username must be present";
      }
    },

  logoff() {
      this.view = "Login";
      this.input.username = "";
      this.user=null;
      this.leaves=null;
      this.holidays=null;
    },

  setVacation(){
      this.action = "vacation";
    },
    
  setHoliday(){
      this.action = "holiday";
    },

  setLeave(){
      this.action = "leave";
      for(const leave of this.leaves){
        if(leave.type==='sick'){
          this.stat.allSick.push(leave.date);
          this.stat.sickHol.push(leave.date);
        }else{
          this.stat.allVacation.push(leave.date);
          this.stat.vacHol.push(leave.date);
        }

      }
      for(const holiday of this.holidays){
        this.stat.sickHol.push(holiday.date);
        this.stat.vacHol.push(holiday.date); 

      }
      this.stat.sickHol.sort(function(a, b){
      var aa = moment(a).format('YYYY-MM-DD'),
          bb = moment(b).format('YYYY-MM-DD');
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
      });
      this.stat.vacHol.sort(function(a, b){
      var aa = moment(a).format('YYYY-MM-DD'),
          bb = moment(b).format('YYYY-MM-DD');
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
      });
      
      this.stat.ssDate = this.stat.allSick[0];
      this.start = this.stat.ssDate;
      for(let i=0; i<30; i++){
        for(let j=0; j<this.stat.sickHol.length;j++) {
          if(this.start===this.stat.sickHol[i]){
            this.start=moment(this.start).add(1, 'days').format('YYYY-MM-DD');
          }else if(moment(this.start).format('dddd')==='Sunday' || moment(this.start).format('dddd')==='Saturday'){
            this.start=moment(this.start).add(1, 'days').format('YYYY-MM-DD');
          }else{
            this.stat.esDate=moment(this.start).subtract(1, 'days').format('YYYY-MM-DD');

          }
        }
      }
      this.stat.svDate=  this.stat.allVacation[0];
      this.start = this.stat.svDate;
      for(let i=0; i<30; i++){
        for(let j=0; j<this.stat.vacHol.length;j++) {
          if(this.start===this.stat.vacHol[i]){
            this.start=moment(this.start).add(1, 'days').format('YYYY-MM-DD');
          }else if(moment(this.start).format('dddd')==='Sunday' || moment(this.start).format('dddd')==='Saturday'){
            this.start=moment(this.start).add(1, 'days').format('YYYY-MM-DD');
          }else{
            this.stat.evDate=moment(this.start).subtract(1, 'days').format('YYYY-MM-DD');
          }
        } 

      }
      
    },

  setApply(){
      this.action="applyLeave";
      this.apply.AstartDate="";
      this.apply.AendDate="";
      this.apply.Atype="";
      this.apply.Aerror="";
      this.apply.Adays="";
    },

  setDelete(){
      this.action="deleteLeave";
      this.del.stDate="";
      this.del.enDate="";
      this.del.msg="";
    },

  getNow(){
    this.timestamp= moment().format('MMMM Do YYYY, h:mm a');
  },
  
  async validateDelete(){
      if(this.del.stDate !== "" && this.del.enDate !== ""){
        if(moment(this.currentDate).isAfter(this.del.stDate)){
          this.del.isDelMsg = true;
          this.del.msg= "You cannot delete the leaves from past!! "
        } else if(moment(this.del.stDate).isAfter(this.del.enDate)){
          this.del.isDelMsg = true;
          this.del.msg="End date cannot be lesser than Start date";
        } else{
          this.date=this.del.stDate;
          this.del.Ddays=moment(this.del.enDate).diff(moment(this.del.stDate), 'days') + 1 ;
          
          for(let i = 0; i < this.del.Ddays; i++){
            for(let k = 0; k < this.leaves.length; k++){
              this.leave=this.leaves[k];
              if(this.date === this.leave.date){
                this.status = await removeLeaves(this.leave.id);
                if(this.status === 200){
                  this.del.isDelMsg = true;
                  this.del.msg="Leaves deleted successfully";
                  this.del.stDate="" ;
                  this.del.enDate="" ; 
                  this.del.Ddays="";
                  this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD'); 
                }else{
                  this.del.isDelMsg = true;
                  this.del.msg="Leaves are not deleted";
                }
              }else{
                this.del.isDelMsg = true;
                this.del.msg="No leaves recorded for this date";
              }
            }
          }

        }
      }else{
        this.del.isDelMsg = true;
        this.del.msg= "Please provide start and end date"
      }
      
  },

  async Validate(){
    if(this.apply.AstartDate !== "" && this.apply.AendDate !== "" && this.apply.Atype !==""){
      if(moment(this.currentDate).isAfter(this.apply.AstartDate)){
          this.apply.isDateError = true;
          this.apply.Aerror="Start Date cannot be lesser than current date";
      } 
      
      else if(moment(this.apply.AstartDate).isAfter(this.apply.AendDate)){
        this.apply.isDateError = true;
        this.apply.Aerror="End date cannot be lesser than Start date";
      }
      else if(moment(this.apply.AstartDate).format('dddd')==='Sunday' || moment(this.apply.AendDate).format('dddd')==='Saturday'){
        this.apply.isDateError = true;
        this.apply.Aerror="Cannot apply leaves on sunday or saturday"; 
      }

      else if(moment(this.apply.AendDate).format('dddd')==='Sunday' || moment(this.apply.AendDate).format('dddd')==='Saturday'){
        this.apply.isDateError = true;
        this.apply.Aerror="Cannot apply leaves on sunday or saturday"; 
      }
      
      else if(moment(this.apply.AendDate).format('YYYY') != moment(this.currentDate).format('YYYY')){
        this.apply.isDateError = true;
        this.apply.Aerror="You can only apply leaves for current year"; 
      }
      else{
        for(let l = 0; l < this.holidays.length; l++){
          this.holiday =this.holidays[l];
          if(this.apply.AendDate === this.holiday.date || this.apply.AstartDate === this.holiday.date ){
            this.apply.isDateError = true;
            this.apply.Aerror="Cannot apply leaves on public holidays ";
          }
        }
        this.apply.isDateError = false;
        this.date=this.apply.AstartDate;
        this.apply.Adays=moment(this.apply.AendDate).diff(moment(this.apply.AstartDate), 'days') + 1 ;
        for(let i = 0; i < this.apply.Adays; i++){
          for(let k = 0; k < this.leaves.length; k++){
              this.leave=this.leaves[k];
              if(this.date === this.leave.date){
                  this.apply.isDateError = true;
                  this.apply.present=true;
                  this.apply.Aerror="Already you have applied leaves for this date";
              }

          }
          if(this.apply.present===false){
            var addleaves = {
              "userId": this.user.id,
              "date": this.date,
              "type": this.apply.Atype
              }
              this.status = await recordLeaves(addleaves); 
              console.log(this.status)
          }
              this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
         }
         if (this.status===200){
            this.apply.isDateError = true;
            this.apply.Aerror="Leaves applied successfully";
            this.apply.AstartDate="";
            this.apply.AendDate="";
            this.apply.Atype="";
            this.apply.Adays=""; 
                
         }
      }
        
    } else{
      this.apply.isDateError = true;
      this.apply.Aerror="Please provide all the fields"
      }  
    }
  }

};


</script>

