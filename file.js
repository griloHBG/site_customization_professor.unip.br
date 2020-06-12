/*
Este código permite colar notas (a partir do clipboard) das provas NP1, NP2 e EXAME.

É NECESSÁRIO TER NO NAVEGADOR UMA EXTENSÃO (ou addon) QUE PERMITA INJEÇÃO DE JavaScript EM SITES
- No Chrome, existe o User JavaScript and CSS (https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld)
- No Firefox, existe o

Como utilizar:
1 - Escrevas TODAS as notas dos alunos (com as faltas também - NC) no Excel ou Word ou notepad++
	1.1 - 	Se Excel, as notas devem estar em uma mesma coluna, cada uma em uma linha
			Se Word ou notepad++, deve ser uma nota por linha e EXCLUSIVAMENTE a nota na linha
2 - Copiar (ctrl-c) as notas
3 - Colar (ctrl-v) no primeiro espaço de inserção de nota da prova que você deseja inserir no sistema (seja NP1, NP2 ou EXAME)
4 - Pronto. Basta confirmar a inserção.
*/

document.addEventListener('paste', pasteCallback);

console.log("customização");

function pasteCallback(event)
{
	let field = document.activeElement;

	const exp = /gvNotas_ctl(\d\d)_txtNota((B\d)|E)/i;

	console.log("oi");

	if( exp.test(field.id) )
	{

		event.preventDefault();

		const beginId = document.activeElement.id.substring(0, 11);

		const endId = document.activeElement.id.substring(13);

		const initIndex = parseInt(document.activeElement.id.substring(11,13));

		let paste = (event.clipboardData || window.clipboardData).getData('text').trim();

		const splittedPaste = paste.split("\n");
		console.log(splittedPaste);

		let next = null;

		let inputIndex = initIndex;

		console.log(paste);
		console.log(paste.length);

		let thereIsNext = true;

		for (let pasteIndex = 0; pasteIndex < splittedPaste.length; pasteIndex++)
		{
			
			if( isNaN(parseFloat(splittedPaste[pasteIndex])) )
			{
				field.value = splittedPaste[pasteIndex];
				console.log(splittedPaste[pasteIndex]);
			}
			else
			{
				field.value = String(parseFloat(splittedPaste[pasteIndex].replace(",",".")).toFixed(1)).replace(".",",");
				console.log(splittedPaste[pasteIndex]);
			}
			
			field.style.backgroundColor = "yellow";
			
			console.log("value: " + field.value);

			inputIndex = inputIndex + 1;

			if( inputIndex < 10 )
			{
				next = beginId + "0" + inputIndex + endId;
			}
			else
			{
				next = beginId + inputIndex + endId;
			}

			console.log("next = " + next);

			if(document.getElementById(next) === null)
			{
				thereIsNext = false;
				console.log("ACABOU! ( o último foi " + field.id + "! )");
				break;
			}
			else
			{
				field = document.getElementById(next);
				field.focus();
			}
		}
	}
}

/* objetivo:

<!DOCTYPE html>
<html>
<head>
<style>
th, td {
  border: 1px solid;
}
.right_align
{
  text-align: right;
}
</style>
</head>
<body>

<h1>The td colSpan attribute</h1>

<table style="width:100%;">
  <tr>
  <th></th>
  <th>NP1</th>
  <th>NP2</th>
  <th>EXAME</th>
  <th>Méd. Final</th>
  </tr>
  <tr>
  <td class="right_align">Alunos Presentes</td>
</tr>
<tr>
<td class="right_align">Nota Média</td>
</tr>
<tr>
<td class="right_align">Maior Nota</td>
</tr>
<tr>
<td class="right_align">Menor Nota</td>
</tr>
<tr>
<td class="right_align">Notas Boas</td>
</tr>
<tr>
<td class="right_align">Nota Ruins</td>
</tr>
<tr>
<td colSpan=3 class="right_align">Aprovações:</td>
<td colSpan=3 style="text-align:left;+">10</td>
  </tr>
  <tr>
  <td colSpan=3 class="right_align">Não aprovações:</td>
<td colSpan=3 style="text-align:left;">10</td>
  </tr>
  </table>

  </body>
   </html>
   */

let metric_prefix = ["attendees", "mean", "highest", "lowest", "good", "bad"];
let metric_suffix = ["NP1", "NP2", "EX", "MF"];

let metric_elements = {attendeesNP1:"", meanNP1:"", highestNP1:"", lowestNP1:"", goodNP1:"", badNP1:"",
                        attendeesNP2:"", meanNP2:"", highestNP2:"", lowestNP2:"", goodNP2:"", badNP2:"",
                        attendeesEX:"", meanEX:"", highestEX:"", lowestEX:"", goodEX:"", badEX:"",
                        attendeesMF:"", meanMF:"", highestMF:"", lowestMF:"", goodMF:"", badMF:"",
                        approved: "", not_approved: ""};
function updateColors()
{
	if(document.getElementById("gvNotas"))
  {
    let students = document.getElementById("gvNotas").children[0];

    let n_students = students.children.length;

	let current_td;
	let current_inputText;
	let np1;
	let np2;
	let ex;

    for (let i = 1; i < n_students; i++)
    {
		current_td = students.children[i].children[3];
      if (current_td.innerText !== "NC") {

        current_inputText = current_td.children[0];
        current_inputText.onchange = gradeChanged;
        np1 = parseFloat(current_inputText.value.replace(",","."));
		
		if(np1 >= 7)
		{
		  current_td.style.backgroundColor = "#70e470";
		}
		else
		{
		  current_td.style.backgroundColor = "#ff8080";
		}
      }

		current_td = students.children[i].children[4];
      if (current_td.innerText !== "NC") {

        current_inputText = current_td.children[0];
        current_inputText.onchange = gradeChanged;
        np2 = parseFloat(current_inputText.value.replace(",","."));
		
		if(np2 >= 7)
		{
		  current_td.style.backgroundColor = "#70e470";
		}
		else
		{
		  current_td.style.backgroundColor = "#ff8080";
		}
      }
		
		current_td = students.children[i].children[8];
      if (current_td.innerText !== "NC") {

        current_inputText = current_td.children[0];
        current_inputText.onchange = gradeChanged;
        ex = parseFloat(current_inputText.value.replace(",","."));
		
		if(0.5*(np1+np2) + ex >= 10)
		{
		  current_td.style.backgroundColor = "#70e470";
		}
		else
		{
		  current_td.style.backgroundColor = "#ff8080";
		}
      }
        

		current_td = students.children[i].children[9];
		
		if(parseFloat(current_td.innerText.replace(",","."))>=5)
		{
		  current_td.style.backgroundColor = "#70e470";
		}
		else
		{
		  current_td.style.backgroundColor = "#ff8080";
		}
    }
  }
}

function update_report_table()
{
  console.log("update");
  let output = report();

  if(metric_elements && output)
  {
    for(let metric_name of metric_prefix)
    {
      for(let test_name of metric_suffix)
      {
        if(output[metric_name][test_name] === "NaN" || (output['attendees'][test_name] === 0 && metric_name !== "attendees"))
        {
          metric_elements[metric_name + test_name].innerText = "--";
        }
        else
        {
          metric_elements[metric_name + test_name].innerText = output[metric_name][test_name];
        }
      }
    }
    console.log(output);
  }

  metric_elements.attendeesMF.innerText = "--";

  metric_elements.approved.innerText = output.good.MF + " alunos (" + (100*output.good.MF/output.total_num_students).toFixed(1) + "%)";
  metric_elements.not_approved.innerText = output.bad.MF + " alunos (" + (100*output.bad.MF/output.total_num_students).toFixed(1) + "%)";
	
	document.getElementById("num_students").innerText = output.total_num_students
	
  updateColors();
}

function doCustomization()
{
	let temp_element;
	if (document.getElementById("new_functions_div") == null && document.getElementById("upDadosTurma")) {
		let injected_div = document.getElementById("upDadosTurma").getElementsByTagName("div")[0];

		let new_functions_div = document.createElement("DIV");
		new_functions_div.id = "new_functions_div";
		new_functions_div.style.width = "100%";

		injected_div.appendChild(new_functions_div);

		let new_options = ["Copiar nomes", "Copiar nomes e RA"];

		let new_options_functions = [copyNamesOnly, copyNamesAndRA];

    for (let i in new_options)
    {
      temp_element = document.createElement("A");
      temp_element.innerText = new_options[i];
      temp_element.classList.add("new_options");
      temp_element.onclick = new_options_functions[i];

      new_functions_div.appendChild(temp_element);
    }

    let report_table = document.createElement("TABLE");
    report_table.classList += "report_table";
    new_functions_div.appendChild(report_table);

    report_table.appendChild(document.createElement("TR"));

    let report_table_header_names = ["Métricas", "NP1", "NP2", "EX", "MF"];

    for(let i in report_table_header_names)
    {
      let temp_th = document.createElement("TH");
      temp_th.innerText = report_table_header_names[i];
      report_table.children[0].appendChild(temp_th);
    }

    let metric_names = ["Presentes", "Nota média", "Maior nota", "Menor nota", "Notas boas", "Notas ruins"];


    for(let i in metric_names)
    {
      let temp_tr = document.createElement("TR");
      let temp_td = document.createElement("TD");
      temp_td.innerText = metric_names[i];
      temp_td.classList += "first_td";
      temp_tr.appendChild(temp_td);

      for(let j = 1; j < report_table_header_names.length; j++)
      {
        temp_td = document.createElement("TD");
        temp_td.id = metric_prefix[i] + report_table_header_names[j];
        temp_tr.appendChild(temp_td);
      }

      report_table.appendChild(temp_tr);
    }

    let temp_tr = document.createElement("TR");
    report_table.appendChild(temp_tr);

    let temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    let link_update_report_table = document.createElement("A");
    temp_td.appendChild(link_update_report_table);
    link_update_report_table.onclick = update_report_table;
    link_update_report_table.innerText = "Atualizar Métricas";
    link_update_report_table.id = "metrics_button";
    temp_td.rowSpan = 2;

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.innerText = "Total de alunos:";
    temp_td.rowSpan = 2;

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.id = "num_students";
    temp_td.rowSpan = 2;

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.innerText = "Aprovados";
    temp_td.style.textAlign = "right";
    temp_td.style.border = "0px";

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.style.border = "0px";
    temp_td.id = "approved";
    metric_elements.approved = temp_td;

    temp_tr = document.createElement("TR");
    report_table.appendChild(temp_tr);

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.innerText = "Não Aprovados";
    temp_td.style.textAlign = "right";
    temp_td.style.border = "0px";

    temp_td = document.createElement("TD");
    temp_tr.appendChild(temp_td);
    temp_td.style.border = "0px";
    temp_td.id = "not_approved";
    metric_elements.not_approved = temp_td;
    
	
		for (let metric of metric_prefix)
		{
			for (let suffix of metric_suffix)
			{
			  metric_elements[metric + suffix] = (document.getElementById(metric + suffix));
			}
		}
	}
}


setInterval(doCustomization, 500);

function gradeChanged(e)
{
	e.currentTarget.style.backgroundColor = "yellow";
	console.log(e.currentTarget.id + " mudou!");
}

function getEachRowString()
{
  if(document.getElementById("gvNotas"))
  {
    let students = document.getElementById("gvNotas").children[0];

    let n_students = students.children.length;

    let students_RA = [];
    let students_name = [];
    let students_NP1 = [];
    let students_NP2 = [];
    let students_EX = [];
    let students_MF = [];

    for (let i = 1; i < n_students; i++) {
      students_RA.push(students.children[i].children[0].innerText);
      students_name.push(students.children[i].children[1].innerText);
      console.log("a");
		
      if (students.children[i].children[3].innerText === "NC") {
        students_NP1.push("NC");
      } else {
        students_NP1.push(students.children[i].children[3].children[0].value);
        students.children[i].children[3].children[0].onchange = gradeChanged;
      }

      if (students.children[i].children[4].innerText === "NC") {
        students_NP2.push("NC");
      } else {
        students_NP2.push(students.children[i].children[4].children[0].value);
        students.children[i].children[4].children[0].onchange = gradeChanged;
      }

      if (students.children[i].children[8].innerText === "NC") {
        students_EX.push("NC");
      } else {
        students_EX.push(students.children[i].children[8].children[0].value);
        students.children[i].children[8].children[0].onchange = gradeChanged;
      }

      students_MF.push(students.children[i].children[9].innerText);
    }

    return {students_RA, students_name, students_NP1, students_NP2, students_EX, students_MF};
  }
}

function copyNamesOnly()
{
	console.log("fn copyNamesOnly");
	let students_name = getEachRowString()['students_name'];

	let output_string = students_name[0];

	for (let i = 1; i < students_name.length; i++)
	{
		output_string = output_string + "\n" + students_name[i];
	}

	storeOnClipboard(output_string);

	console.log("stored on clipboard: \n" + output_string);
	alert("Nomes dos alunos copiados!\nUtilize Ctrl+V para colá-los em algum lugar!")
}

function maxValue(arr) {
  let max = arr[0];

  for (let val of arr) {
    if (val > max) {
      max = val;
    }
  }
  return max;
}

function minValue(arr) {
  let min = arr[0];

  for (let val of arr) {
    if (val < min) {
      min = val;
    }
  }
  return min;
}

function report()
{
	let output = getEachRowString();
	if(output) {
    let tests = {NP1: output["students_NP1"],
                  NP2: output["students_NP2"],
                  EX: output["students_EX"],
                  MF: output["students_MF"]};

    let thresholds = {NP1:7, NP2:7, EX:0, MF:5};

    let good_grade_counter = {NP1:0, NP2:0, EX:0, MF:0};
    let bad_grade_counter = {NP1:0, NP2:0, EX:0, MF:0};
    let nc_counter = {NP1:0, NP2:0, EX:0, MF:0};
    let attendees = {NP1:0, NP2:0, EX:0, MF:0};
    let mean = {NP1:0, NP2:0, EX:0, MF:0};
    let highest_grade = {NP1:0, NP2:0, EX:0, MF:0};
    let lowest_grade = {NP1:0, NP2:0, EX:0, MF:0};

    let total_num_students = tests.NP1.length;

    for (let test_name of metric_suffix) {
      for (let grade of tests[test_name]) {
        if (grade === "NC" || grade === "--") {
          nc_counter[test_name] = nc_counter[test_name] + 1;
        } else {
          grade = parseFloat(grade.replace(",", "."));

          if(grade > highest_grade[test_name])
          {
            highest_grade[test_name] = grade;
          }

          if(grade < lowest_grade[test_name])
          {
            lowest_grade[test_name] = grade;
          }

          if (grade >= thresholds[test_name]) {
            good_grade_counter[test_name] = good_grade_counter[test_name] + 1;
          } else {
            bad_grade_counter[test_name] = bad_grade_counter[test_name] + 1;
          }

          mean[test_name] = (mean[test_name] + grade);
        }
      }

      attendees[test_name] = tests[test_name].length - nc_counter[test_name];
      mean[test_name] = (mean[test_name] / attendees[test_name]).toFixed(2);
    }

    let highest = highest_grade;
    let lowest = lowest_grade;
    let good = good_grade_counter;
    let bad = bad_grade_counter;

    return {total_num_students, attendees, mean, highest, lowest, good, bad};
  }
}

function copyNamesAndRA()
{
	console.log("fn copyNamesAndRA");

	const output = getEachRowString();
	const students_name = output['students_name'];
	const students_RA = output['students_RA'];

	let output_string = students_RA[0] + "\t" + students_name[0];

	for (let i = 1; i < students_name.length; i++)
	{
		output_string = output_string + "\n" + students_RA[i] + "\t" + students_name[i];
	}

	storeOnClipboard(output_string);

	console.log("stored on clipboard: \n" + output_string);
	alert("Nomes e RA dos alunos copiados!\nUtilize Ctrl+V para colá-los em algum lugar!")
}

function storeOnClipboard(text)
{
	const el = document.createElement("TEXTAREA");
	// Does not work:
	// dummy.style.display = "none";
	el.style.height = '0px';
	// Does not work:
	// el.style.width = '0px';
	el.style.width = '1px';
	document.body.appendChild(el);
	el.value = text;
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
}
