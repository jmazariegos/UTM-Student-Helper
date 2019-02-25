package noteTakingFiles;

import java.io.FileNotFoundException;
import java.io.PrintWriter;

public class Text {

	public Text() throws FileNotFoundException
	{
		try (PrintWriter out = new PrintWriter("hahayes.txt"))
		{
			out.println("kachigga");
		}
	}
	
}
