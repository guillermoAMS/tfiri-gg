# resize_images_and_pascalvoc_data.py
# Author: Angel Seiji Morimoto Burgos
# 
# Python script for resizing images and modifying accordingly bounding boxes information stored in
# PascalVOC XML files.

import cv2
import getopt
import glob
import numpy as np
import os
import sys
import xml.etree.ElementTree as ET

# Initialization of global variables.
target_size = 0
in_img_dir = ""
in_xml_dir = ""
out_img_dir = ""
out_xml_dir = ""
images = 0


def resize_images_and_pascalvoc():
  global images
  for in_img_file_name in glob.glob(os.path.join(in_img_dir, '*.jpg')):
    images = images + 1
    print(images)

    image = cv2.imread(in_img_file_name, 1)
    y = float(image.shape[0])
    x = float(image.shape[1])
    y_scale = target_size / y
    x_scale = target_size / x
    resizedImage = cv2.resize(image, (target_size, target_size))

    in_xml_file_name = in_img_file_name.replace(in_img_dir, in_xml_dir).replace('.jpg', '.xml').replace('.JPG', '.xml')
    tree = ET.parse(in_xml_file_name)
    root = tree.getroot()
    size = root.find('size')
    width = size.find('width')
    height = size.find('height')

    xml_width = int(np.round(int(width.text) * x_scale))
    xml_height = int(np.round(int(height.text) * y_scale))

    width.text = str(target_size)
    height.text = str(target_size)

    for obj in root.findall('object'):
      bndbox = obj.find('bndbox')
      xmin = bndbox.find('xmin')
      ymin = bndbox.find('ymin')
      xmax = bndbox.find('xmax')
      ymax = bndbox.find('ymax')
      
      # If original and resized are of the same orientation.
      if xml_width == target_size and xml_height == target_size:
        xmin.text = str(int(np.round(int(xmin.text) * x_scale)))
        ymin.text = str(int(np.round(int(ymin.text) * y_scale)))
        xmax.text = str(int(np.round(int(xmax.text) * x_scale)))
        ymax.text = str(int(np.round(int(ymax.text) * y_scale)))
      # If a 90 degree rotation has to be applied to the right to the bounding boxes.
      else:
        ymin_tmp = str(int(np.round(int(xmin.text) * y_scale)))
        xmax_tmp = str(target_size - int(np.round(int(ymin.text) * x_scale)))
        ymax_tmp = str(int(np.round(int(xmax.text) * y_scale)))
        xmin_tmp = str(target_size - int(np.round(int(ymax.text) * x_scale)))
        xmin.text = xmin_tmp
        ymin.text = ymin_tmp
        xmax.text = xmax_tmp
        ymax.text = ymax_tmp
    
    out_img_file_name = in_img_file_name.replace(in_img_dir, out_img_dir)
    out_xml_file_name = in_xml_file_name.replace(in_xml_dir, out_xml_dir)

    cv2.imwrite(out_img_file_name, resizedImage)
    tree.write(out_xml_file_name) 


def main(argv):
  global target_size, in_img_dir, in_xml_dir, out_img_dir, out_xml_dir
  try:
    opts, args = getopt.getopt(argv, "", ["size=", "in_img_dir=", "in_xml_dir=", "out_img_dir=", "out_xml_dir="])
  except getopt.GetoptError:
    print('resize_images_and_pascalvoc_data.py --size <target_size> --in_img_dir <input image dir> --in_xml_dir <input xml dir> --out_img_dir <output image dir> --out_xml_dir <output xml dir>')
    sys.exit(2)
  num_options = 0
  for opt, arg in opts:
    if opt == '--size':
      target_size = int(arg)
      num_options = num_options + 1
    elif opt == '--in_img_dir':
      in_img_dir = arg
      if in_img_dir[-1] == '/':
        in_img_dir = in_img_dir[:-1]
      num_options = num_options + 1
    elif opt == '--in_xml_dir':
      in_xml_dir = arg
      if in_xml_dir[-1] == '/':
        in_xml_dir = in_xml_dir[:-1]
      num_options = num_options + 1
    elif opt == '--out_img_dir':
      out_img_dir = arg
      if out_img_dir[-1] == '/':
        out_img_dir = out_img_dir[:-1]
      num_options = num_options + 1
    elif opt == '--out_xml_dir':
      out_xml_dir = arg
      if out_xml_dir[-1] == '/':
        out_xml_dir = out_xml_dir[:-1]
      num_options = num_options + 1
  if num_options != 5:
    print('All options are required.')
    print('resize_images_and_pascalvoc_data.py --size <target_size> --in_img_dir <input image dir> --in_xml_dir <input xml dir> --out_img_dir <output image dir> --out_xml_dir <output xml dir>')
  else:
    resize_images_and_pascalvoc()
    print('Images and PascalVOC data successfully resized!')
  
if __name__ == '__main__':
  main(sys.argv[1:])