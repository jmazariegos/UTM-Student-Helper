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


public class EventGUI extends JApplet{

	/**
	 * 
	 */
	private static final long serialVersionUID = -8814604997415822330L;
	private JPanel pan;
	
	public void init() {
		
		JButton btEnter = new JButton("Enter");
		
		//Textfields
		JTextField tfEventName = new JTextField(20);
		JTextField tfDescription = new JTextField(20);
		JTextField tfStartDate = new JTextField(20);
		JTextField tfStartTime = new JTextField(20);
		JTextField tfEndDate = new JTextField(20);
		JTextField tfEndTime = new JTextField(20);
		
		//Labels
		JLabel lblEventName = new JLabel("Event Name:");
		JLabel lblDescription = new JLabel("Description:");
		JLabel lblStartDate = new JLabel("Start Date (YYYYMMDD):");
		JLabel lblStartTime = new JLabel("Start Time (HHMM):");
		JLabel lblEndDate = new JLabel("End Date (YYYYMMDD):");
		JLabel lblEndTime = new JLabel("End Time (HHMM):");
		
		
		// Invalid Labels
		String inv = "Invalid Entry";
		JLabel invlblEventName = new JLabel();
		JLabel invlblDescription = new JLabel();
		JLabel invlblStartDate = new JLabel();
		JLabel invlblStartTime = new JLabel();
		JLabel invlblEndDate = new JLabel();
		JLabel invlblEndTime = new JLabel();

		btEnter.addActionListener(new ActionListener() {

			public void actionPerformed(ActionEvent e) {
				//Check if all entries are valid
				boolean valid = true;
				String eventName = tfEventName.getText();
				String description = tfDescription.getText();
				String startDate = tfStartDate.getText();
				String startTime = tfStartTime.getText();
				String endDate = tfEndDate.getText();
				String endTime = tfEndTime.getText();
				
				if (eventName.isEmpty()){
					valid = false;
					invlblEventName.setText(inv);
				}else{
					invlblEventName.setText("Valid");
				}
				
				if (description.isEmpty()){
					valid = false;
					invlblDescription.setText(inv);
				}else{
					invlblDescription.setText("Valid");
				}
				
				if (startDate.isEmpty() || !isDate(startDate)){
					valid = false;
					invlblStartDate.setText(inv);
				}else{
					invlblStartDate.setText("Valid");
				}
				
				if (startTime.isEmpty() || !isTime(startTime)){
					valid = false;
					invlblStartTime.setText(inv);
				}else{
					invlblStartTime.setText("Valid");
				}
				
				if (endDate.isEmpty() || !isDate(endDate)){
					valid = false;
					invlblEndDate.setText(inv);
				}else{
					invlblEndDate.setText("Valid");
				}
				
				if (endTime.isEmpty() || !isTime(endTime)){
					valid = false;
					invlblEndTime.setText(inv);
				}else{
					invlblEndTime.setText("Valid");
				}
				
				//AddEvent
				if (valid) {
					try {
						try{
							//AddEvent ae = new AddEvent("WILLITWORK","Meeting about 301", "20190212", "1900","20190212", "2359");
							AddEvent ae = new AddEvent(eventName,description, startDate, startTime, endDate, endTime);
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
		
		pan.add(lblEventName);
		pan.add(tfEventName);
		pan.add(invlblEventName);
		
		pan.add(lblDescription);
		pan.add(tfDescription);
		pan.add(invlblDescription);
		
		pan.add(lblStartDate);
		pan.add(tfStartDate);
		pan.add(invlblStartDate);
		
		pan.add(lblStartTime);
		pan.add(tfStartTime);
		pan.add(invlblStartTime);
		
		pan.add(lblEndDate);
		pan.add(tfEndDate);
		pan.add(invlblEndDate);
		
		pan.add(lblEndTime);
		pan.add(tfEndTime);
		pan.add(invlblEndTime);
		
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
