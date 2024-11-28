import rticonnextdds_connector as rti
import json
import threading
import time
import sys
import os
import queue
from websockets import serve
from websockets.exceptions import ConnectionClosed
import asyncio
sys.path.append(os.path.abspath("C:/Users/rayan/OneDrive/Documents/GitHub/kfupmclinic/src/RTISystem/RTITest"))
from Config import *
