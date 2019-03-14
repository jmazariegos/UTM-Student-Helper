package src.calendarFiles;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

import javax.swing.ImageIcon;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import org.json.simple.parser.ParseException;

//imports from addEvents

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;

//import org.json.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.*;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;


public class DueDateGUI extends JApplet{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8814604997415822330L;
	private JPanel pan;
	
	public void init() {
		
		JButton btEnter = new JButton("Enter");
		
		//Textfields
		JTextField tfAssignmentName = new JTextField(20);
		JTextField tfCourseCode = new JTextField(20);
		JTextField tfDescription = new JTextField(20);
		JTextField tfDueDate = new JTextField(20);
		JTextField tfDueTime = new JTextField(20);
		
		//Labels
		JLabel lblAssignmentName = new JLabel("Assignment Name:");
		JLabel lblCourseCode = new JLabel("Course Code:");
		JLabel lblDescription = new JLabel("Description:");
		JLabel lblDueDate = new JLabel("Due Date (YYYYMMDD):");
		JLabel lblDueTime = new JLabel("Due Time (HHMM):");

		
		
		// Invalid Labels
		String inv = "Invalid Entry";
		JLabel invlblAssignmentName = new JLabel();
		JLabel invlblCourseCode = new JLabel();
		JLabel invlblDescription = new JLabel();
		JLabel invlblDueDate = new JLabel();
		JLabel invlblDueTime = new JLabel();


		btEnter.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				//Check if all entries are valid
				boolean valid = true;
				String assignmentName = tfAssignmentName.getText();
				String courseCode = tfCourseCode.getText();
				String description = tfDescription.getText();
				String dueDate = tfDueDate.getText();
				String dueTime = tfDueTime.getText();
				
				if (assignmentName.isEmpty()){
					valid = false;
					invlblAssignmentName.setText(inv);
				}else{
					invlblAssignmentName.setText("Valid");
				}
				
				if (courseCode.isEmpty()){
					valid = false;
					invlblCourseCode.setText(inv);
				}else{
					invlblCourseCode.setText("Valid");
				}
				
				if (description.isEmpty()){
					valid = false;
					invlblDescription.setText(inv);
				}else{
					invlblDescription.setText("Valid");
				}
				
				if (dueDate.isEmpty() || !isDate(dueDate)){
					valid = false;
					invlblDueDate.setText(inv);
				}else{
					invlblDueDate.setText("Valid");
				}
				
				if (dueTime.isEmpty() || !isTime(dueTime)){
					valid = false;
					invlblDueTime.setText(inv);
				}else{
					invlblDueTime.setText("Valid");
				}
	
				
				//AddEvent
				if (valid) {
					try {
						try{
							//AddEvent ae = new AddEvent("WILLITWORK","Meeting about 301", "20190212", "1900","20190212", "2359");
							AddDueDate ae = new AddDueDate(assignmentName, courseCode, description, dueDate, dueTime);
						}catch (FileNotFoundException e2){
							System.out.println("FNF");
							e2.printStackTrace();
						}
					} catch (IOException | ParseException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
				
				//lab.setText(tf.getText());
			}
			
		});
		
		pan = new JPanel();
		pan.setLayout(new GridLayout(7,3));
		//pan.setPreferredSize(new Dimension(640,480));
		pan.setVisible(true);
		pan.setFocusable(true);
		
		pan.add(lblAssignmentName);
		pan.add(tfAssignmentName);
		pan.add(invlblAssignmentName);
		
		pan.add(lblCourseCode);
		pan.add(tfCourseCode);
		pan.add(invlblCourseCode);
		
		pan.add(lblDescription);
		pan.add(tfDescription);
		pan.add(invlblDescription);
		
		pan.add(lblDueDate);
		pan.add(tfDueDate);
		pan.add(invlblDueDate);
		
		pan.add(lblDueTime);
		pan.add(tfDueTime);
		pan.add(invlblDueTime);
		
		pan.add(btEnter);
		
		
		
		this.add(pan);
		this.setVisible(true);
		this.setSize(new Dimension(640,480));
		
	}
	
	public boolean isDate(String date){
		if(date.length() != 8) return false;
		
		
		String year = date.substring(0, 4);
		String month = date.substring(4, 6);
		String day = date.substring(6, 8);
		
		int yearNum = Integer.parseInt(year);
		int monthNum = Integer.parseInt(month);
		int dayNum = Integer.parseInt(day);
		
		if (monthNum < 1 || dayNum < 1)return false;
		
		if (monthNum > 12) return false;
		
		int thirtyone[] = {1,3,5,7,8,10,12};
		for(int i = 0; i < thirtyone.length; i ++){
			if(thirtyone[i] == monthNum){
				if (dayNum > 31) return false;
			}
		}
		
		int thirty[] = {4,6,9,11};
		for(int i = 0; i < thirty.length; i ++){
			if(thirty[i] == monthNum){
				if (dayNum > 30) return false;
			}
		}
		
		if (monthNum == 2){
			if(yearNum%4 == 0 && (yearNum%100 != 0 || yearNum%400 == 0)){
				//leap year
				if (dayNum > 29) return false;
			}else{
				if (dayNum > 28) return false;
			}
		}
		
		return true;
		
	}
	
	public boolean isTime(String time){
		if(time.length() != 4) return false;
		
		String hour = time.substring(0, 2);
		String minute = time.substring(2, 4);
		
		int hourNum = Integer.parseInt(hour);
		int minuteNum = Integer.parseInt(minute);
		
		if (hourNum < 0 || minuteNum < 0) return false;
		
		if (hourNum >= 24) return false;
		if (minuteNum >= 60) return false;

		
		return true;
	}
	
	/*
	public static void main(String args[]){
		System.out.println("Cool");
		EventGUI eg = new EventGUI();
	}*/
	
}