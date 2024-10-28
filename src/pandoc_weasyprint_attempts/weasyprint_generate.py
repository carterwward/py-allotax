# import logging
# import weasyprint

# Set up logging for weasyprint
# logging.basicConfig(level=logging.DEBUG, filename='weasyprint.log', filemode='w',
#                     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


# def convert_html_to_pdf(tool: str, html_file_path: str, output_file_path: str) -> None:
#     """Convert HTML to PDF using the specified tool."""
#     path = os.path.abspath(html_file_path)
#     match tool:
#         case 'pyhtml2pdf':
#             converter.convert(
#                 f'file:///{path}', output_file_path,
#                 print_options={"landscape": True, "scale": 0.8, "marginLeft": 0}
#             )
#             print("PDF conversion complete using pyhtml2pdf.")
#         # TODO: needs some CSS tinkering to get the layout right
#         # case 'weasyprint':  # utf-8 required when reading from file
#         #     logger = logging.getLogger('weasyprint')
#         #     logger.addHandler(logging.FileHandler('weasyprint.log'))
#         #     logger.setLevel(logging.DEBUG)

#             # TODO: logging shows weasyprint fails to render SVG image; can't find solution
#             # research suggests weasyprint has had trouble with SVG support.
#             # weasyprint.HTML(filename=path, encoding='utf-8')\
#             #     .write_pdf(target=output_file_path, presentational_hints=True)
#             # print("PDF conversion complete using WeasyPrint.")
#         case _:
#             print("Invalid tool selected.")