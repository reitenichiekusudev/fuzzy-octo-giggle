#include <iostream>
#include <string>
#include <stdlib.h>
#include <time.h>
using namespace std;

int main (void)
{
	int choice;
	bool gamefinished = false;
	string name;
	cout<<"please enter your name"<<endl;
	getline(cin,name);
while(gamefinished == false)
{
	cout<<"current player name: "<<name<<endl;
	cout<<"1. start the game"<<endl<<"2. Change the player name"<<endl<<"3. show highest scores"<<endl<<"4. exit"<<endl;
	cin>>choice;
	cin.ignore();
		if(choice == 4)
			{
				cout<<"thank you for playing!"<<endl;
				gamefinished = true;
			}
}
}