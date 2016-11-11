angular.module('resumeApp.controllers', []).
controller('resumeController', function($scope) {

    $scope.showCard = false;

    $scope.addResume = function(){
        if(document.getElementById('file').files[0] != undefined) {
            var file = document.getElementById('file').files[0],
                reader = new FileReader();

            reader.onloadend = function (e) {
                var data = e.target.result;
                Materialize.toast(file.name + ' has been uploaded!', 4000);
                $scope.extractResume(data);
            };
            reader.readAsBinaryString(file);
        }
    };

    $scope.parseEmployment = function (i, data) {
        var readingEmp = false;
        var employment ={};
        var summary = [];
        var lines = data.split('\n');

        for(var x = i ; x< lines.length; x++){
            if(lines[x] != undefined){
                if(lines[x]==""){
                    employment.summary = summary;
                    $scope.resume.Employment.push(employment);
                    readingEmp = false;
                    employment = {};
                    summary = [];
                }else{
                    if(lines[x].includes("Title: ")){
                        employment.title = lines[x].replace("Title: ", '');
                        readingEmp = true;
                    }
                    if(lines[x].includes("Company: ")){
                        employment.company = lines[x].replace("Company: ", '');
                    }
                    if(lines[x].includes("Dates: ")){
                        employment.dates = lines[x].replace("Dates: ", '');
                    }
                    if(lines[x].startsWith('*')){
                        summary.push(lines[x].replace("* ", ''));
                    }
                }
            }
         }
        $scope.resume.Employment.shift();
    };

    $scope.extractResume = function(data){
        var phoneRex = /[(]\d{3}[)]?[ ]?\d{3}[-]?\d{4}/;
        var emailRex = /[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
        $scope.resume.Info.phone = phoneRex.exec(data)[0];
        $scope.resume.Info.email = emailRex.exec(data)[0];

        var lines = data.split('\n');
        for(var i = 0;i < lines.length;i++){
            if(lines[i].includes("Name: ")){
                $scope.resume.Info.name = lines[i].replace("Name: ", '');
            }
            if(lines[i].includes("OBJECTIVE")){
                $scope.resume.Objective = lines[i+1];
            }
            if(lines[i].includes("Development: ")){
                $scope.resume.Skill.Development = lines[i].replace("Development: ", '').split(',');
            }
            if(lines[i].includes("Project Management: ")){
                $scope.resume.Skill.Management = lines[i].replace("Project Management: ", '').split(',');
            }
            if(lines[i].includes("School: ")){
                $scope.resume.Education.school = lines[i].replace("School: ", '');
            }
            if(lines[i].includes("Degree: ")){
                $scope.resume.Education.degree = lines[i].replace("Degree: ", '');
            }
            if(lines[i].includes("Major: ")){
                $scope.resume.Education.major = lines[i].replace("Major: ", '');
            }
            if(lines[i].includes("EMPLOYMENT HISTORY")){
                $scope.parseEmployment(i, data);
            }
        }
        $scope.showCard= true;
        $scope.$apply();
    };

    $scope.resume = {
        Info:{
            name: '',
            email: '',
            phone: ''
        },
        Objective: '',
        Skill: {
            Development: [],
            Management: []
        },
        Employment:[{
            title: '',
            company:'',
            dates: '',
            summary:[]
        }],
        Education:{
            school:'',
            degree:'',
            major: ''
        }
    };
});