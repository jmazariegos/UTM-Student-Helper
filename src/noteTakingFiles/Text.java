package noteTakingFiles;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

//https://www.homeandlearn.co.uk/java/write_to_textfile.html

public class Text {

	String currPath;
	
	public Text()
	{
		currPath = "file.txt";
	}
	
	//for changing the file
	public void setPath(String path) 
	{
		currPath = path;
	}
	
	//overwrites a file with a line
	public void writeToFile(String line) throws IOException 
	{
		FileWriter write = new FileWriter( currPath , false);
		PrintWriter print = new PrintWriter(write);
		print.printf("%s" + "%n", line);
		print.close();
	}
	
	//reads all contents of file
	public void readFromFile() throws IOException
	{
		FileReader file = new FileReader(currPath);
		BufferedReader br = new BufferedReader(file);
		
		String s;
		while((s = br.readLine()) != null)
		{
			System.out.println(s);
		}
		
		
		file.close();
	}
	
}
