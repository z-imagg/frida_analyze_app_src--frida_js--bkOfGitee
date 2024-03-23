/** C++多线程混乱竞争例子
 * 编译命令: g++ -g1 dork_cpp/ThreadChaosRaceDemo.cpp -o dork_cpp/ThreadChaosRaceDemo.elf
 * 运行命令: ./dork_cpp/ThreadChaosRaceDemo.elf
*/
#include <iostream>
#include <thread>

void sleepS(int seconds){
    std::this_thread::sleep_for(std::chrono::seconds(seconds));
}

void sleepMs(int ms){
    std::this_thread::sleep_for(std::chrono::milliseconds(ms));
}

void sleepRandMs(int ms){
    std::this_thread::sleep_for(std::chrono::milliseconds(std::rand()%ms));
}

void sleep1PlusRandMs(int ms){
    std::this_thread::sleep_for(std::chrono::milliseconds(1+std::rand()%ms));
}

std::string createStr1(std::string title1,int v1 ){
    std::string msg;
    msg.append(title1); msg.append(std::to_string(v1));
    msg.append("\n");
    return msg;
}

std::string createStr2(std::string title1,int v1,std::string title2,int v2){
    std::string msg;
    msg.append(title1); msg.append(std::to_string(v1));
    msg.append(title2);  msg.append(std::to_string(v2));
    msg.append("\n");
    return msg;
}
void buszFunc(int threadIdx,int *p_gVar) {
    sleepRandMs(10);
    (*p_gVar)= ( ++(*p_gVar) );

    std::cout << createStr2("进入业务函数,线程",threadIdx,",全局变量=",*p_gVar);

    sleepRandMs(5);

    std::cout <<  createStr1("离开业务函数,线程",threadIdx );
}

#define ThreadCnt 10
int main() {
    int gVar=0;
    std::thread threads[ThreadCnt];
    for (int thrdIdx = 0; thrdIdx < ThreadCnt; ++thrdIdx) {
        threads[thrdIdx] = std::thread(buszFunc, thrdIdx,&gVar);
        sleepRandMs(3);
        threads[thrdIdx].detach();
    }

    std::cout << "主线程进入休眠\n"  ;
    sleepS(ThreadCnt/3);
    std::cout << "主线程退出\n"  ;

    return 0;
}
