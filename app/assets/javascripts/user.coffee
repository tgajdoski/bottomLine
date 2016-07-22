class Users extends Backbone.View
    events:
        "click #addUser" : "addUser"
    initialize: ->
        @el.find("tbody>tr").each (i,user) ->
            new User
                el: $(user)
    addUser: ->
        context = this
        $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Add a User"
            buttons: [
                text: "Add"
                click: ->
                    jsRoutes.controllers.Application.doSignup().ajax
                        data:
                            email: $("#email").val()
                            password: $("#password").val()
                            repeatPassword: $("#repeatPassword").val()
                            name: $("#username").val()
                        success: (data) ->
                            _view = new User
                                el: $(data).appendTo(context.el.find("tbody"))
                        error: (err) ->
                            alert("There was an error adding the user! Please refresh the page and try again.")
                    $("#dialog").dialog "close"
            ]
        $("#dialog").html("Username ").append($("<input/>").attr("id","username"))
            .append("<br/>Email ").append($("<input/>").attr("id","email"))
            .append("<br/>Password ").append($("<input/>").attr("id","password").attr("type","password"))
            .append("<br/>Repeat password ").append($("<input/>").attr("id","repeatPassword").attr("type","password"))
            .dialog "open"

class User extends Backbone.View
    events:
        "click  .deleteUser"    : "deleteUser"
        "change .userAuthority" : "updateUser"
        "click  .resetPassword" : "resetPassword"
    deleteUser: ->
        context = this
        if (confirm("Are you sure?"))
            jsRoutes.controllers.Users.deleteUser().ajax
                data:
                    id: context.el.attr("data-user-id")
                success: (data) ->
                    context.el.remove()
                error: (err) ->
                    alert("There was an error deleting the user! Please refresh the page and try again.")
    updateUser: (e) ->
        context = this
        target = $(e.currentTarget)
        jsRoutes.controllers.Users.updateUser().ajax
            data:
                id: context.el.attr("data-user-id")
                authority: target.val()
            error: (err) ->
                alert("There was an error updating the user! Please refresh the page and try again.")
    resetPassword: ->
        context = this
        $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Add a User"
            buttons: [
                text: "Reset"
                click: ->
                    jsRoutes.controllers.Users.updateUser().ajax
                        data:
                            id: context.el.attr("data-user-id")
                            password: $("#password").val()
                        error: (err) ->
                            alert("There was an error resetting the user's password! Please refresh the page and try again.")
                    $("#dialog").dialog "close"
            ]
        $("#dialog").html("Password ").append($("<input/>").attr("id","password").attr("type","password"))
            .dialog "open"

$ ->
    users = new Users
        el: $("#users")
