(function($){  
  $(function(){    
    // Base Foundation Javascript Calls
    $(document).foundationAlerts();
    //$(document).foundationAccordion();
    //$(document).tooltips();
    $('input, textarea').placeholder();
    $(document).foundationButtons();
    $(document).foundationNavigation();
    //$(document).foundationCustomForms();
    //$(document).foundationTabs({callback:$.foundation.customForms.appendCustomMarkup});
    
    // First Document Ready
    var location = window.location
      page = location.hash;
    
    if(page != '' && page != null && page != undefined) {
      $('.window').css('display','none');
      $(page).css('display','inherit');
      loadStorage(page);
    }
    else {
      loadStorage('#today');
    }
   
    // Set Settings
    Settings.init();
    
    // Navigation
    $('nav').on('click','a',function () {
      var $this = $(this),
        id = $this.attr('href'),
        reveal_id = $this.data('reveal-id');
        
      if(id != '#') {
        $('.window').css('display','none');
        $('#loading').css('display','inherit');
        loadStorage(id);
        $('#loading').css('display','none');
        $(id).css('display','inherit');
      }
      else if($this.hasClass('nowhere')) {
        return false;
      }
    });
  });
  
  // load view all storage items
  function loadStorage(page) {
    var $table;
     
    $(page + ' .loader').html('<table></table>'); 
    $table = $(page + ' .loader').find('table');

    switch(page) {
      case '#today':
        var today = new Date(),
          date = today.toDateString(),
          list = Today.get(),
          todolist,
          tasks = Task.get(),
          projects = Project.get();
          if(list != null && list[date] != null) {
            todolist = list[date];
          }
          else {
            todolist = new Array();
          }
                $table.append('<thead><tr><th>ID</th><th>Completed</th><th>Priority</th><th>Task</th><th>Estimate</th><th>Due Date</th><th>Actions</th></tr></thead><tbody>');
        for(var id in todolist) {
          var taskID = todolist[id],
            temp = tasks[taskID];
          if(tasks.hasOwnProperty(taskID)) {
            $table.append('<tr><td>' + taskID + '</td><td>' + (temp['completed_on'] == null?'':'&#10004;') + '</td><td>' + temp['priority'] + '</td><td><strong>' + temp['task'] + '</strong> in ' + projects[parseInt(temp['projectID'])] + '</td><td>' + temp['estimate'] + '</td><td>' + temp['due_on'] + '</td><td><a href="#pomodoro."' + taskID + '" class="tiny round success button">Track</a> <a href="#done.' + taskID +'" class="tiny round button">Complete</a></td></tr>')
          }
        }
        $table.append('</tbody>');
          
        break;
      case '#proj_all':
        var projects = Project.get();
        $table.append('<thead><tr><th>ID</th><th>Project</th><th>Actions</th></tr></thead><tbody>');
        for(var projectID in projects) {
          if(projects.hasOwnProperty(projectID)) {
            $table.append('<tr><td>' + projectID + '</td><td>' + projects[projectID] + '</td><td><a href="#proj_edit.' + projectID + '" class="button round tiny success">Edit</a> <a href="#proj_delete.' + projectID + '" class="button round tiny alert">Delete</a></td></tr>')
          }
        }
        $table.append('</tbody>');
        break;
      case '#task_all':
        var tasks = Task.get(),
          projects = Project.get(),
          list = Today.get(),
          today = new Date(),
          date = today.toDateString(),
          todolist;
        if(list != null && list[date] != null) {
          todolist = list[date];
        }
        else {
          todolist = new Array();
        };
         $table.append('<thead><tr><th>ID</th><th>Completed</th><th>Priority</th><th>Task</th><th>Estimate</th><th>Due Date</th><th>Actions</th></tr></thead><tbody>');
        for(var taskID in tasks) {
          var temp = tasks[taskID];
          
          if(tasks.hasOwnProperty(taskID)) {
            $table.append('<tr><td>' + taskID + '</td><td>' + (temp['completed_on'] == null?'':'&#10004;') + '</td><td>' + temp['priority'] + '</td><td><strong>' + temp['task'] + '</strong> in ' + projects[parseInt(temp['projectID'])] + '</td><td>' + temp['estimate'] + '</td><td>' + temp['due_on'] + '</td><td><a href="#task_edit.' + taskID + '" class="button round tiny success">Edit</a> <a href="#task_delete.' + taskID + '" class="button round tiny alert">Delete</a> ' + (temp['completed_on'] == null && $.inArray(parseInt(taskID), todolist) == -1?'<a href="#add.' + taskID + '" class="round tiny button"">Add To Do Today</a>':'') + '</td></tr>')
          }
        }
        $table.append('</tbody>');
        break;
      case '#reports':
        break;
      case '#task_new':
        var projects = Project.get(),
          options = dropdown(projects,'id','value',null);
        $(page + ' select[name=projectID]').html(options);
      case '#settings':
        var settings = Settings.get();
        $(page + ' input[name=task_time]').val(settings['task_time']);
        $(page + ' input[name=short_break]').val(settings['short_break']);
        $(page + ' input[name=long_break]').val(settings['long_break']);
        if(settings['wind_sound']) {
          $(page + ' input[name=wind_sound]').attr('checked','checked');
        }
        if(settings['ding_sound']) {
          $(page + ' input[name=ding_sound]').attr('checked','checked');
        }
        if(settings['tick_sound']) {
          $(page + ' input[name=tick_sound]').attr('checked','checked');
        }
        break;
      default:
        break;
    }
  }
  // Make form drop down options
  function dropdown(obj, value, display, selected) {
    var option = '', 
      value;
    if(value == 'id') {
      for(id in obj) {
        if(display == 'value') {
          value = obj[id];  
        }
        else {
          var obj2 = obj[id];
          value = obj2[display];
        }
        if(selected == id) {
          option += '<option value="' + id + '" selected>' + value + '</option>'
        }
        else {
          option += '<option value="' + id + '">' + value + '</option>'
        }
      }
    }
    return option;
  }
  
  // Form Validation Function
  $.validity.setup({ outputMode:"modal" });
  function validateForm(selector) {
    $.validity.start();
    $(selector + ' .require').require();
    $(selector + ' input[type=date]').match('date');
    $(selector + ' input[type=hidden]').match('integer');
    var result = $.validity.end();
    return result.valid;
  }
  
  // Form Submission
  $('form').on('click','input[type=submit]', function (e) {
    e.preventDefault();
    var $this = $(this),
      form_id = $this.parents('form').attr('id');
    if(validateForm('#' + form_id)) {
      switch(form_id) {
        case 'new_proj':
          var name = $('#' + form_id + ' input[type=text]').val();
          Project.set(name);
          $('#' + form_id).prepend('<div class="alert-box success">Project Added.</div>').find('.alert-box').delay(10000).fadeOut('fast');
          $('#' + form_id + ' input[type=text]').val('');
          break;
        case 'edit_proj':
          var id = $('#' + form_id + ' input[name=projectID]').val() ,
              value = $('#' + form_id + ' input[name=project]').val(),
            obj = {
              projectID: id,
              name: value
            };
          Project.set(obj);
          $('#' + form_id).prepend('<div class="alert-box success">Project Updated.</div>').find('.alert-box').delay(10000).fadeOut('fast');
          break;
        case 'new_task':
          var new_task = {
            task: $('#' + form_id + ' input[name=task]').val(),
            projectID: $('#' + form_id + ' [name=projectID]').val(),
            estimate: $('#' + form_id + ' input[name=estimate]').val(),
            due_on: $('#' + form_id + ' input[name=due_on]').val(),
            priority: $('#' + form_id + ' [name=priority]').val(),
            completed_on: null
          };
          Task.set(new_task);
          $('#' + form_id).prepend('<div class="alert-box success">Task Added.</div>').find('.alert-box').delay(10000).fadeOut('fast');
          $('#' + form_id + ' input:not([type=submit])').val('');
          var projects = Project.get(),
            options = dropdown(projects,'id','value',null);
          $('#' + form_id + ' select[name=projectID]').html(options);
          break;
        case 'edit_task':
          var new_task = {
            task: $('#' + form_id + ' input[name=task]').val(),
            projectID: $('#' + form_id + ' [name=projectID]').val(),
            estimate: $('#' + form_id + ' input[name=estimate]').val(),
            due_on: $('#' + form_id + ' input[name=due_on]').val(),
            priority: $('#' + form_id + ' [name=priority]').val(),
            completed_on: null,
            taskID: parseInt($('#' + form_id + ' [name=taskID]').val()),
          };
          Task.set(new_task);
          $('#' + form_id).prepend('<div class="alert-box success">Task Updated.</div>').find('.alert-box').delay(10000).fadeOut('fast');
          var projects = Project.get(),
            options = dropdown(projects,'id','value',null);
          $('#' + form_id + ' select[name=projectID]').html(options);
          break;
        case 'setting_form':
          var settings = {
            task_time: $('#' + form_id + ' input[name=task_time]').val(),
            short_break: $('#' + form_id + ' input[name=short_break]').val(),
            long_break: $('#' + form_id + ' input[name=long_break]').val(),
            wind_sound: $('#' + form_id + ' input[name=wind_sound]').attr('checked') == 'checked'?true:false,
            ding_sound: $('#' + form_id + ' input[name=ding_sound]').attr('checked') == 'checked'?true:false,
            tick_sound: $('#' + form_id + ' input[name=tick_sound]').attr('checked') == 'checked'?true:false,
          };
          Settings.set(settings);
          Settings.init();
          $('#' + form_id).prepend('<div class="alert-box success">Settings Updated.</div>').find('.alert-box').delay(10000).fadeOut('fast');
          break;
        default:
          break;
      }
    }
    return false;
  });
  
  // View All Action Links (Edit/Delete)
  $('body').on('click','.loader a',function (e) {
    e.preventDefault();
    var $this = $(this),
      href = $this.attr('href'),
      pattern = /(.+)\.(\d+)$/,
      match = pattern.exec(href);
      action = match[1],
      id = match[2];
      
      $('.window').css('display','none');
      $(action).css('display','inherit');
      
      switch(action) {
        case '#proj_edit':
          var projects = Project.get(),
            project = projects[id];
          $('#edit_proj input[name=project]').val(project);
          $('#edit_proj input[name=projectID]').val(id);
          break;
        case '#proj_delete':
          var check = confirm("Are you sure?");
          if(check) {
            Project.remove(id);
            loadStorage('#proj_all');
            $('#proj_all').css('display','inherit');
          }
          break;
        case '#add':
          Today.set(id);
          loadStorage('#today');
          $('#today').css('display','inherit');
          break;
        case '#task_edit':
          var taskID = id;
          var tasks = Task.get(),
            task = tasks[taskID],
            projects = Project.get(),
            options = dropdown(projects,'id','value',parseInt(task['projectID']));
          $('#edit_task select[name=projectID]').html(options);
          $('#edit_task input[name=task]').val(task['task']);
          $('#edit_task input[name=taskID]').val(taskID);
          $('#edit_task select[name=priority] option[value=' + parseInt(task['projectID']) + ']').attr('selected','selected');
          $('#edit_task input[name=due_on]').val(task['due_on']);
          $('#edit_task input[name=estimate]').val(task['estimate']);
          break;
        case '#task_delete':
          var check = confirm("Are you sure?");
          if(check) {
            Task.remove(id);
            loadStorage('#task_all');
            $('#task_all').css('display','inherit');
          }
          break;
        default:
          break;
      }
  });
  
})(jQuery);
