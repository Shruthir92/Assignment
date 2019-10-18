<template>
  <v-app>
    <div id="login" v-if="loginType === 'Login'">
      <h1>Leave Management System</h1>
      <v-text-field  type="text" name="username" v-model="input.username" placeholder="Username"/>
      <br>
      <v-btn color="purple" dark rounded raised type="button" v-on:click="login()">Login</v-btn>
      <p v-if="isError">{{ message }}</p>
    </div>
    <div id="leave" v-if="loginType === 'Leave'">
      <p>
        Welcome {{ rows.name }} !!
        <v-btn text absolute right color="red" type="button" v-on:click="logoff()">Logoff</v-btn>
      </p>

      <h1>Leave details</h1>
      <h5 align="right"><span>{{timestamp}}</span></h5>

      <v-simple-table id="firstTable" dense light>
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
           <td>Vacation </td> 
            <td>{{rows.holidays + vacationRecorded }}</td>
            <td>{{ rows.holidays }}</td>
            <td>{{vacationRecorded}}</td>
            
          </tr>
          <tr>
           <td>Sick </td> 
            <td>{{rows.sickdays + sickRecorded }}</td>
            <td>{{ rows.sickdays }}</td>
            <td>{{sickRecorded}}</td>
            
          </tr>
        </tbody>
      </v-simple-table>
      <p>
      <v-btn color="green" dark rounded absolute right raised type="button" v-on:click="applyLeaves()">Apply Leave</v-btn>
      </p>
      <br>
      <br>
      
        <h3 color="Blue">Recorded Leave/Holiday Details</h3>
        <br>
      <v-sheet height="400" width="800" float="centre">
    <v-calendar
      type="month"
      color="blue" 
      is-dark
      dark
    ></v-calendar>
  </v-sheet> 
      <br>
<p>      
<v-btn color="purple" dark rounded raised  type="button" v-on:click="setVacation()">Leave Details</v-btn>

<v-btn color="purple" dark rounded raised type="button" v-on:click="setHoliday()">Holiday Details</v-btn>
</p>
      <div v-if="leaveType === 'vacation'">
      <h3>Recorded Leave Details</h3>
      <v-simple-table id="firstTable">
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
      <br>
      <div v-if="leaveType === 'holiday'">
       <h3>Public Holidays</h3>
      <v-simple-table id="firstTable">
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
    </div>
  </v-app>
</template>




<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: "Login",
  data() {
    return {
      isError: false,
      loginType: "Login",
      leaveType:"vacation",
      applyLeave:false,
      message: "",
      timestamp:"",
      rows: {
        id:"",
        name:"",
        holidays:"",
        sickdays:""
      },
      leaves:[],
      holidays:[],
      leave: {
        date:"",
        id:"",
        type:"",
        userid:""
      },
     sickRecorded:0,
     vacationRecorded:0,
      axiosInstance: axios.create({
      baseURL: "https://leaves.speakup.systems/api",
      headers: {
        "x-api-key": "grdcJnsPdRac8aor66yV46ySis5xDKbZ3KNinTqE"
      }
    }),
      input: {
        username: ""
      }
    };
  },

created() {
            setInterval(this.getNow, 1000);
            },
   
  
  methods: {
  async  login() {
   
      this.message = "";;
      this.loginType = "Login";
      
      if (this.input.username !== "") {

     await this.getUser(this.input.username);
     this.getNow();
     
        if (this.input.username === this.rows.name) {
          this.loginType = "Leave";
          await this.getLeaves(this.rows.id);
          await this.getPublicHolidays();
          
          for(let i = 0; i <= this.leaves.length; i++){
            this.leave=this.leaves[i]
           if (this.leave.type === "sick"){
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

    applyLeaves(){
          this.applyLeave=true;

    },

    logoff() {
      this.loginType = "Login";
      this.input.username = "";
    },

    setVacation(){
      this.leaveType = "vacation";
    },
    
    setHoliday(){
      this.leaveType = "holiday";
    },

    async getUser(name){
    try {
      const response = await this.axiosInstance.get("/users", {
        params: {
          name
        }
       
      },
      )
      this.rows = response.data;
      return response.data
    } catch(error) {
      return false
    }
  },


  async getLeaves(userId){
    try {
      const response = await this.axiosInstance.get("/leaves", {
        params: {
          userId
        }
      })
      this.leaves = response.data;
      return response.data
    } catch(error) {
      return false
    }
  },

  async removeLeaves(ids){
    try {
      const response = await this.axiosInstance.delete("/leaves", {
        params: {
          ids: ids.toString()
        }
      })
      return response.data
    } catch(error) {
      return false
    }
  },

  async getPublicHolidays(){
    try {
      const response = await this.axiosInstance.get("/public-holidays")
      this.holidays = response.data;
      return response.data
    } catch(error) {
      return false
    }
  },

  async recordLeaves(leaves){
    try {
      const response = await this.axiosInstance.post("/leaves", {
        leaves
      })
      return response.data
    } catch(error) {
      return false
    }
  },

  getNow(){
    this.timestamp= moment().format('MMMM Do YYYY, h:mm a');
  }
  }

};


</script>

