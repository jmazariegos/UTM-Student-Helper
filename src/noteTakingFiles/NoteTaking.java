package noteTakingFiles;

public class NoteTaking {

	public static void main(String[] args)
	{
		Text t = new Text();
		
		try
		{
			t.writeToFile("hello");
			t.writeToFile("hi");
			t.readFromFile();
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
	}
	
}
