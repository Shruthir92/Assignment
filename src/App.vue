<template>
  <v-app>
    <v-container fluid v-if="view === 'Login'">
      <v-row>
        <v-col cols="12">
          <h1>Leave Management System</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field solo type="text" name="username" v-model="input.username" label="Username" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <p class="red--text" v-if="isError">{{ message }}</p>
        </v-col>
        <v-col cols="1">
          <v-btn color="teal" block type="button" @click="login">Login</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-else-if="view === 'Leave'">
      <v-row>
        <v-col cols="10" class="blue--text">
          <h4>Welcome {{ input.username }} !!</h4>
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn text color="red" type="button" @click="logoff">Logoff</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="10">
          <h3>Leave Statistics</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h5>{{timestamp}}</h5>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <v-simple-table dense dark>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Total Leaves</th>
                <th>Remaining Leaves</th>
                <th>Availed Leaves</th>
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
        <v-col cols="2">
          <v-btn color="teal" block type="button" @click="setHoliday">Holidays List</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="teal" block type="button" @click="setLeave">Leave Details</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="teal" block type="button" @click="setApply">Apply Leaves</v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn color="teal" block type="button" @click="setDelete">Delete Leaves</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <div v-if="action === 'holiday'">
            <h3>Public Holidays</h3>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Holiday Date</th>
                  <th>Holiday Name</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holiday in holidays">
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
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Leave Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="leavestat in leavestats">
                  <td>{{leavestat.start}}</td>
                  <td>{{leavestat.end }}</td>
                  <td>{{leavestat.type }}</td>
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
                    <v-text-field
                      type="date"
                      name="startDate"
                      v-model="apply.startDate"
                      label="Start Date"
                    />
                  </td>
                  <td>
                    <v-text-field
                      type="date"
                      name="endDate"
                      v-model="apply.endDate"
                      label="End Date"
                    />
                  </td>
                  <td>
                    <v-select v-model="apply.type" label="Leave Type" :items="['vacation', 'sick']"></v-select>
                  </td>
                  <td>
                    <span>Num of Days: {{apply.days}}</span>
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
                    <p class="red--text" v-if="apply.isDateError">{{ apply.error }}</p>
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
                    <v-text-field
                      type="date"
                      name="startDate"
                      v-model="remove.startDate"
                      label="Start Date"
                    />
                  </td>
                  <td>
                    <v-text-field
                      type="date"
                      name="endDate"
                      v-model="remove.endDate"
                      label="End Date"
                    />
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
                    <p class="red--text" v-if="remove.error">{{ remove.message }}</p>
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
import {
  getUser,
  getLeaves,
  getPublicHolidays,
  removeLeaves,
  recordLeaves
} from "./api.js";
import moment from "moment";

export default {
  name: "App",
  data() {
    return {
      isError: false,
      view: "Login",
      action: "vacation",
      message: "",
      timestamp: "",
      user: null,
      rows: {
        id: "",
        name: "",
        holidays: "",
        sickdays: ""
      },
      date: "",
      dates: [],
      leaves: [],
      holidays: [],
      allLeaves: [],
      currentDate: moment().format("YYYY-MM-DD"),
      leave: {
        id: "",
        date: "",
        userid: "",
        type: ""
      },
      holiday: {
        id: "",
        date: "",
        name: ""
      },
      status: "",
      sickRecorded: 0,
      vacationRecorded: 0,

      input: {
        username: ""
      },
      apply: {
        startDate: "",
        endDate: "",
        type: "",
        days: "",
        error: "",
        isDateError: false,
        present: false
      },
      remove: {
        startDate: "",
        endDate: "",
        message: "",
        error: false,
        Ddays: ""
      },
      start: "",
    };
  },

  created() {
    setInterval(this.getNow, 1000);
  },

  methods: {
    async login() {
      this.view = "Login";

      if (this.input.username !== "") {
        this.user = await getUser(this.input.username);
        this.setLeave()
        if (this.user) {
          this.view = "Leave";
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
      this.user = null;
      this.leaves = null;
      this.holidays = null;
    },

    async setHoliday() {
      this.action = "holiday";
      this.holidays = await getPublicHolidays();
      this.holidays = this.sortDates(this.holidays)
    },

    async setLeave() {
      this.action = "leave";
      this.leaves = await getLeaves(this.user.id);
      this.leaves = this.sortDates(this.leaves)
      for (const leave of this.leaves) {
        if (leave.type === "sick") {
          this.sickRecorded = this.sickRecorded + 1;
        } else {
          this.vacationRecorded = this.vacationRecorded + 1;
        }
      }
    },

    setApply() {
      this.action = "applyLeave";
      this.apply.startDate = "";
      this.apply.endDate = "";
      this.apply.type = "";
      this.apply.error = "";
      this.apply.days = "";
    },

    setDelete() {
      this.action = "deleteLeave";
      this.remove.startDate = "";
      this.remove.endDate = "";
      this.remove.message = "";
    },

    getNow() {
      this.timestamp = moment().format("MMMM Do YYYY, h:mm a");
    },

    async validateDelete() {
      if (this.remove.startDate !== "" && this.remove.endDate !== "") {
        if (moment(this.currentDate).isAfter(this.remove.startDate)) {
          this.remove.error = true;
          this.remove.message = "You cannot delete the leaves from past!! ";
        } else if (moment(this.remove.startDate).isAfter(this.remove.endDate)) {
          this.remove.error = true;
          this.remove.message = "End date cannot be lesser than Start date";
        } else {
          let date = this.remove.startDate;
          this.remove.Ddays =
            moment(this.remove.endDate).diff(moment(this.remove.startDate), "days") + 1;

          for (let i = 0; i < this.remove.Ddays; i++) {
            for (let k = 0; k < this.leaves.length; k++) {
              this.leave = this.leaves[k];
              if (date === this.leave.date) {
                this.status = await removeLeaves(this.leave.id);
                if (this.status === 200) {
                  this.remove.error = true;
                  this.remove.message = "Leaves deleted successfully";
                  this.remove.startDate = "";
                  this.remove.endDate = "";
                  this.remove.Ddays = "";
                  date = moment(date)
                    .add(1, "days")
                    .format("YYYY-MM-DD");
                } else {
                  this.remove.error = true;
                  this.remove.message = "Leaves are not deleted";
                }
              } else {
                this.remove.error = true;
                this.remove.message = "No leaves recorded for this date";
              }
            }
          }
        }
      } else {
        this.remove.error = true;
        this.remove.message = "Please provide start and end date";
      }
    },

    async Validate() {
      if (
        this.apply.startDate !== "" &&
        this.apply.endDate !== "" &&
        this.apply.type !== ""
      ) {
        if (moment(this.currentDate).isAfter(this.apply.startDate)) {
          this.apply.isDateError = true;
          this.apply.error = "Start Date cannot be lesser than current date";
        } else if (moment(this.apply.startDate).isAfter(this.apply.endDate)) {
          this.apply.isDateError = true;
          this.apply.error = "End date cannot be lesser than Start date";
        } else if ( this.isWeekend(this.apply.startDate) || this.isWeekend(this.apply.endDate) ) {
          this.apply.isDateError = true;
          this.apply.error = "Cannot apply leaves on sunday or saturday";
        } else if (moment(this.apply.endDate).format("YYYY") != moment(this.currentDate).format("YYYY")) {
          this.apply.isDateError = true;
          this.apply.error = "You can only apply leaves for current year";
        } else if(this.isHoliday(this.apply.startDate) || this.isHoliday(this.apply.endDate)){
            this.apply.isDateError = true;
            this.apply.error = "Cannot apply leaves on public holidays ";
        } else {
          const leaveDates = new Array()
          let date = this.apply.startDate;
          this.apply.days =
            moment(this.apply.endDate).diff(
              moment(this.apply.startDate),
              "days"
            ) + 1;
          for (let i = 0; i < this.apply.days; i++) {
            for (let k = 0; k < this.leaves.length; k++) {
              this.leave = this.leaves[k];
              if (date === this.leave.date) {
                this.apply.isDateError = true;
                this.apply.present = true;
                this.apply.error =
                  "Already you have applied leaves for this date";
                return
              }
            }
            leaveDates.push({
              userId: this.user.id,
              date: date,
              type: this.apply.type
            })
            date = moment(date)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }
          if(!this.apply.isDateError) {
            this.status = await recordLeaves(leaveDates);
            if (this.status === 200) {
              this.apply.isDateError = true;
              this.apply.error = "Leaves applied successfully";
              this.apply.startDate = "";
              this.apply.endDate = "";
              this.apply.type = "";
              this.apply.days = "";
            }
          }
        }
      } else {
        this.apply.isDateError = true;
        this.apply.error = "Please provide all the fields";
      }
    },
    isWeekend(date) {
      return moment(date).day() == 0 || moment(date).day() == 6
    },
    isHoliday(date) {
      for(const holiday of this.holidays){
        if(moment(date).isSame(holiday.date)) {
          return true
        }
      }
      return false
    },
    isAllDatesBetweenIsHoliday(startDate, endDate){
      const previousDate = endDate.subtract(1, "day")
      while(previousDate <= startDate) {
        if(this.isHoliday(previousDate) || this.isWeekend(previousDate)){
          continue
        } else {
          return false
        }
      }
      return true
    },
    sortDates(dates){
      return dates.sort((a, b) =>
        parseInt(moment(a.date).format("x")) >
        parseInt(moment(b.date).format("x"))
          ? 1
          : -1
      );
    },
  },

  computed: {
    leavestats() {
      const leavestats = new Array();
      const sortedLeaves = this.sortDates(this.leaves)
      for (const leave of sortedLeaves) {
        const leavestatsLength = leavestats.length;
        if (leavestatsLength > 0) {
          if (
            (moment(leave.date).diff(moment(leavestats[leavestatsLength - 1].end)) === 86400000 || 
            moment(leave.date).day() === 1 ||
            this.isAllDatesBetweenIsHoliday(moment(leavestats[leavestatsLength-1].end), moment(leave.date))) &&
            leave.type === leavestats[leavestatsLength - 1].type.toLowerCase()
          ) {
            leavestats[leavestatsLength - 1].end = leave.date;
            continue;
          }
        }
        leavestats.push({
          start: leave.date,
          end: leave.date,
          type: leave.type,
        });
      }
      return leavestats;
    },
  }
};
</script>