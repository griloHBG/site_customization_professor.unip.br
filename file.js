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
    var field = document.activeElement;
	
	const exp = /gvNotas_ctl(\d\d)_txtNota((B\d)|E)/i
	
	console.log("oi");
	
	if( exp.test(field.id) )
	{
		
		event.preventDefault();
		
		var beginId = document.activeElement.id.substring(0,11);
		
		var endId = document.activeElement.id.substring(13);
		
		const initIndex = parseInt(document.activeElement.id.substring(11,13))
		
	    let paste = (event.clipboardData || window.clipboardData).getData('text').trim().replace(/\./g,",");
	    
	    var splittedPaste = paste.split("\n");
	    console.log(splittedPaste);
	    
	    var next = null;
	    
	    var inputIndex = initIndex;
	    
	    console.log(paste);
	    console.log(paste.length);
	    
	    var thereIsNext = true;
	    
	    for (var pasteIndex = 0; pasteIndex < splittedPaste.length; pasteIndex++)
	    {
	    	if( isNaN(parseFloat(splittedPaste[pasteIndex])) )
	    	{
	    		field.value = splittedPaste[pasteIndex];
	    		console.log(splittedPaste[pasteIndex]);
	    	}
	    	else
	    	{
	    		field.value = parseFloat(splittedPaste[pasteIndex]).toFixed(1);
	    		console.log(splittedPaste[pasteIndex]);
	    	}
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

function doCustomization()
{
	if(document.getElementById("new_options_table") == null)
	{
	
		father_div = document.getElementById("upDadosTurma").getElementsByTagName("div")[0];
		
		new_options_table = document.createElement("TABLE");
		new_options_table.id = "new_options_table"
		new_options_table.style.width="100%";
		
		father_div.appendChild(new_options_table);
		
		new_options = [["Copiar apenas nomes", "Relatório NP1", "Relatório EXAME"],["Copiar nomes e RA", "Relatório NP2", "Relatório Média Final"]];
		
		new_options_functions = [[copyNamesOnly, ()=>report("NP1"), ()=>report("EX")], [copyNamesAndRA, ()=>report("NP2"), ()=>report("MF")]];
		
		for (var new_options_tr_idx in new_options)
		{
			var row = document.createElement("TR");
			
			for (var new_options_td_idx in new_options[new_options_tr_idx])
			{	
				var table_element = document.createElement("TD");
				temp_element = document.createElement("A");
				temp_element.innerText = new_options[new_options_tr_idx][new_options_td_idx];
				temp_element.classList.add("new_options");
				temp_element.onclick = new_options_functions[new_options_tr_idx][new_options_td_idx];
				
				table_element.appendChild(temp_element);
				row.appendChild(table_element);
			}
			
			new_options_table.appendChild(row);
		}
	}
}

setInterval(doCustomization, 1000);

function getEachRow()
{
	students = document.getElementById("gvNotas").children[0]
	
	n_students = students.children.length;
	
	students_RA = []
	students_name = []
	students_NP1 = []
	students_NP2 = []
	students_EX = []
	students_MF = []
	
	for(var i = 1; i < n_students; i++)
	{
		students_RA.push(students.children[i].children[0].innerText);
		students_name.push(students.children[i].children[1].innerText);
		console.log("a")
		
		if (students.children[i].children[3].innerText == "NC")
		{
			students_NP1.push("NC");
		}
		else
		{
			students_NP1.push(students.children[i].children[3].children[0].value);
		}
		
		if (students.children[i].children[4].innerText == "NC")
		{
			students_NP2.push("NC");
		}
		else
		{
			students_NP2.push(students.children[i].children[4].children[0].value);
		}
		
		if (students.children[i].children[8].innerText == "NC")
		{
			students_EX.push("NC");
		}
		else
		{
			students_EX.push(students.children[i].children[8].children[0].value);
		}
		
		students_MF.push(students.children[i].children[9].innerText);
	}
	
	return {students_RA, students_name, students_NP1, students_NP2, students_EX, students_MF};
}

function copyNamesOnly()
{
	console.log("fn copyNamesOnly");
	students_name = getEachRow()['students_name'];
	
	output_string = ""
	
	for (var i = 0; i < students_name.length; i++)
	{
		output_string = output_string + "\n" + students_name[i];
	}
	
	storeOnClipboard(output_string);
	
	console.log("stored on clipboard: \n" + output_string);
	alert("Nomes dos alunos copiados!\nUtilize Ctrl+V para colá-los em algum lugar!")
}

function report(testName)
{
	console.log("fn reportTest for " + testName);
	students_grade = getEachRow()['students_' + testName];
	
	hasAttendees = true;
	grade_name = "Nota";
	test_name = "";
	
	isMF = false;
	treshold = 7;
	
	switch (testName) {
		case 'NP1':
		case 'NP2':
			test_name = testName;
			break;
		case 'EX':
			test_name = "EXAME";
			break;
		case 'MF':
			hasAttendees = false;
			grade_name = "Média FINAL";
			treshold = 5;
			break;
		
		default:
	}
	
	good_grade_counter = 0;
	bad_grade_counter = 0;
	nc_counter = 0;
	mean = 0;
	
	for (var test_idx in students_grade)
	{
		if(students_grade[test_idx] == "NC")
		{
			nc_counter = nc_counter + 1;
		}
		else
		{
			grade = parseFloat(students_grade[test_idx].replace(",","."));
			
			if(grade >= treshold)
			{
				good_grade_counter = good_grade_counter + 1;
			}
			else
			{
				bad_grade_counter = bad_grade_counter + 1;
			}
			
			mean = mean + grade;
		}
	}
	
	attendees = students_grade.length - nc_counter;
	
	mean = mean / attendees;
	
	alert_string = ""
	
	if(hasAttendees)
	{
		alert_string = alert_string + "Presença " + test_name + ": " + (students_grade.length - nc_counter) + " alunos (" + (100*attendees/students_NP1.length).toFixed(1) + "% de "+ students_grade.length + " alunos)\n"
	}
	
	alert_string = alert_string +
	grade_name + " " + test_name + " >= " + treshold.toFixed(1) + ": " + good_grade_counter + " alunos ( " + (100*good_grade_counter/attendees).toFixed(1) + "% de "+ students_grade.length + " alunos)\n";
	
	alert_string = alert_string +
	grade_name + " " + test_name + " < " + treshold.toFixed(1) + ": " + bad_grade_counter + " alunos ( " + (100*bad_grade_counter/attendees).toFixed(1) + "% de "+ students_grade.length + " alunos)";
	
	alert_string = alert_string +
	test_name + 
	
	alert(alert_string);
}

function copyNamesAndRA()
{
	console.log("fn copyNamesAndRA");
	
	output = getEachRow();
	students_name = output['students_name'];
	students_RA = output['students_RA'];
	
	output_string = students_RA[0] + "\t" + students_name[0];
	
	for (var i = 1; i < students_name.length; i++)
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
