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
	
	private void makeFile() throws FileNotFoundException
	{
		try (PrintWriter out = new PrintWriter("hahayes.txt"))
		{
			out.println("kachigga");
		}
	}
	
	public void writeToFile(String line) throws IOException 
	{
		FileWriter write = new FileWriter( currPath , false);
		PrintWriter print = new PrintWriter(write);
		print.printf("%s" + "%n", line);
		print.close();
	}
	
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
