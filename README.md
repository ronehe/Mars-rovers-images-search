[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6573225&assignment_repo_type=AssignmentRepo)
# ex4-nodejs

<h1>Ronen Heifetz && Leon Markovich</h1>
<p>Email: ronenhe@edu.hac.ac.il</p>
<p>Email: leonmar@edu.hac.ac.il</p>


<h1>Execution</h1>
<p>
Open console, execute : node bin/www
</p>
<p>
Then open your browser at http://localhost:<b>3000</b>
</p>
<h1>About :</h1>
<p> Hello and welcome to nasa api image display site where you <b>and your friends</b> 
may save and display your favorite mars rover pictures..
</p>
<p>
Images are found by searching image by earth/sol date, mission, camera if located
in nasa's db the picture then saved in personal space for each user <b>(until he deletes 
it ! ~ will be saved for  next session ~)</b>
</p>
<p>
Saved images then can be viewed in carousel format or in full size.
The users are saved in data base and images saved in different one ~ found using
session email address for when user is logged in ! ~
</p>
<h1> Nice features : </h1>
<p>When the url is typed incorrectly all site visitors are sent to back to safety 
page which navigates them either to "login" or to "main page" if they have logged in already

When url is typed correctly but isn't permitted for current visitor ( for example 
trying accessing  "main page" but not logged in ) - he then navigated to "login". 
</p>
