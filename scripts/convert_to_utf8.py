import sys

def convert_to_utf8(input_file, output_file):
    with open(input_file, 'r', encoding='utf-16') as f:
        content = f.read()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: convert_to_utf8.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    convert_to_utf8(input_file, output_file)
