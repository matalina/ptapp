/* Settings 'Class' ------------ */
var Settings = { 
  task_time: 25,
  short_break: 5,
  long_break: 15,
  wind_sound: true,
  tick_sound: true,
  ding_sound: true,
  init: function () {
    var settings = $.totalStorage('settings');
    if(settings != null) {
      this.task_time = settings.task_time;
      this.short_break = settings.short_break;
      this.long_break  = settings.long_break;
      this.wind_sound = settings.wind_sound;
      this.tick_sound = settings.tick_sound;
      this.ding_sound = settings.ding_sound;
    }
  },
  set: function (obj) {
    $.totalStorage('settings', obj);
  },
  get: function () {
    var obj = {
      task_time: this.task_time,
      short_break: this.short_break,
      long_break: this.long_break,
      wind_sound: this.wind_sound,
      tick_sound: this.tick_sound,
      ding_sound: this.ding_sound,
    }
    
    return obj;
  },
  clear: function () {
    localStorage.removeItem('settings');
  }
};

/* Project 'Class' ------------ */
var Project = {
  get : function() {
    var projects = $.totalStorage('projects');
    return projects;
  },
  set : function (obj) {
    var projects = this.get(),
      newID; 
    if(typeof(obj) == 'string') {
      if(projects != null) {
        for(var projectID in projects) {
          if(projects.hasOwnProperty(projectID)) {
            newID = parseInt(projectID) + 1;
          }
        }
        projects[newID] = obj;
      }
      else {
        projects = {1: obj};
      }
    }
    else {
      projects[obj.projectID] = obj.name;
    }
    
    $.totalStorage('projects',projects);
  },
  clear : function () {
    localStorage.removeItem('projects');
  },
  remove : function(projectID) {
    var projects = this.get();
      //tasks = Task.get();
    
    delete projects[projectID];
    
    /*for(var taskID in tasks) {
      if(tasks.hasOwnProperty(taskID)) {
        if(tasks[taskID][3] == projectID) {
          task.remove(taskID);
        }
      }
    }*/
    
    $.totalStorage('projects',projects);
  },
};

/* Task 'Class' ------------ */
var Task = {
  get : function() {
    var tasks = $.totalStorage('tasks');
    return tasks;
  },
  set : function (obj) {
    var tasks = this.get(),
      newID, taskID; 
    if(!obj.taskID) {
      if(tasks != null) {
        for(var taskID in tasks) {
          if(tasks.hasOwnProperty(taskID)) {
            newID = parseInt(taskID) + 1;
          }
        }
        tasks[newID] = obj;
      }
      else {
        tasks = {1: obj};
      }
    }
    else {
      taskID = obj.taskID;
      delete obj.taskID;
      tasks[obj.taskID] = obj;
    }
    
    $.totalStorage('tasks',tasks);
  },
  clear : function () {
    localStorage.removeItem('tasks');
  },
  remove : function(taskID) {
    var tasks = this.get();
      //tasks = Task.get();
    
    delete tasks[taskID];
    
    /*for(var taskID in tasks) {
      if(tasks.hasOwnProperty(taskID)) {
        if(tasks[taskID][3] == taskID) {
          task.remove(taskID);
        }
      }
    }*/
    
    $.totalStorage('tasks',tasks);
  },
};

/* Today 'Class' ------------ */
var Today = {
  get : function() {
    var todays = $.totalStorage('todays');
    return todays;
  },
  set : function (obj) {
    var todays = this.get(),
      date = new Date();
      
    date = date.toDateString();
    
    if(todays != null) {
     if(todays[date] == null) {
       todays[date] = new Array();
     }
     todays[date].push(parseInt(obj));
    }
    else {
      todays = new Object();
      todays[date] = new Array(parseInt(obj));
    }
    
    $.totalStorage('todays',todays);
  },
  clear : function () {
    localStorage.removeItem('todays');
  },
  remove : function(todayID) {
    var todays = this.get();
      //todays = today.get();
    
    delete todays[todayID];
    
    $.totalStorage('todays',todays);
  },
};