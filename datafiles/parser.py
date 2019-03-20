import pandas as pd
import sys
#run file as: python3 parser.py csvfile1 csvfile2 ... etc
#at least one csv file must be specified
if len(sys.argv) > 1:
    for x in sys.argv[1:]:
        df = pd.read_csv(x, header=None, names=['TotalServletTime','TotalJDBCTime'])
        TS = df["TotalServletTime"].mean()/1000000
        TJ = df["TotalJDBCTime"].mean()/1000000
        print(x,"TS(ms):",TS,"TJ(ms):",TJ)
else:
    print("This file takes csv files as input")
