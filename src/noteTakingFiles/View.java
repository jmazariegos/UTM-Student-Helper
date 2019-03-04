package noteTakingFiles;

import javax.swing.*;
import java.applet.*;


import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowEvent;
import java.util.ArrayList;

public class View extends JApplet implements ActionListener{

	private JFrame frame;
	private JTextArea text;
	Text t;
	
	private static final long serialVersionUID = 1L;  // just in case
	
	public void init()
	{
		t = new Text();
	
		JPanel panel = new JPanel(new BorderLayout());
		
		JButton save = new JButton("save");
		JButton load = new JButton("load");
		save.setActionCommand("save");
		save.addActionListener(this);
		load.setActionCommand("load");
		load.addActionListener(this);
		
		text = new JTextArea(20, 20);
		text.setText("default");
		
		panel.add(save, BorderLayout.WEST);
		panel.add(load, BorderLayout.EAST);
		panel.add(text);
		
		this.add(panel);
	}
	
	@Override
	public void actionPerformed(ActionEvent e)
	{
		if ("save".equals(e.getActionCommand()))
		{
			try 
			{
				t.writeToFile(text.getText());
			}
			catch(Exception ex)
			{
				System.out.println(ex);
			}
		}
		else if("load".equals(e.getActionCommand()))
		{
			try 
			{
				text.setText(t.readFromFile());
			}
			catch(Exception ex)
			{
				System.out.println(ex);
			}
		}
	}
	
}
